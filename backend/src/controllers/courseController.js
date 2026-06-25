const { Course, CoursePrerequisite, User, Assignment, Progress } = require('../models');
const { ROLES, ERROR_MESSAGES } = require('../utils/constants');
const { Op } = require('sequelize');

/**
 * GET /api/courses
 * Получение списка курсов
 */
const getCourses = async (req, res) => {
  try {
    const { level, isPublished, search } = req.query;
    const where = {};

    if (level) where.level = level;
    if (isPublished !== undefined) where.isPublished = isPublished === 'true';
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (req.user.role === ROLES.METHODIST) {
      where.authorId = req.user.id;
    }

    if (req.user.role === ROLES.SPECIALIST) {
      where.isPublished = true;
    }

    const courses = await Course.findAll({
      where,
      attributes: [
        'id', 'title', 'description', 'coverImage', 'content', 
        'duration', 'level', 'isPublished', 'authorId', 'createdAt', 'updatedAt'
      ],
      include: [
        { 
          model: User, 
          as: 'author', 
          attributes: ['id', 'username', 'role']
        },
        {
          model: Course,
          as: 'prerequisites',
          attributes: ['id', 'title'],
          through: { attributes: [] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Если специалист - проверяем статус и блокировку каждого курса
    if (req.user.role === ROLES.SPECIALIST) {
      const userId = req.user.id;
      
      const completedAssignments = await Assignment.findAll({
        where: { 
          specialistId: userId, 
          status: 'COMPLETED' 
        },
        attributes: ['courseId']
      });
      
      const completedCourseIds = completedAssignments.map(a => a.courseId);
      
      for (const course of courses) {
        const assignment = await Assignment.findOne({
          where: { 
            courseId: course.id, 
            specialistId: userId 
          },
          include: [{ model: Progress, as: 'progress' }]
        });
        
        if (assignment) {
          course.dataValues.status = assignment.status;
          course.dataValues.progress = assignment.progress?.progressPercent || 0;
          course.dataValues.assignmentId = assignment.id;
        } else {
          course.dataValues.status = 'NOT_STARTED';
          course.dataValues.progress = 0;
        }
        
        const prerequisites = course.prerequisites || [];
        let isLocked = false;
        let missingPrereqs = [];
        
        for (const prereq of prerequisites) {
          if (!completedCourseIds.includes(prereq.id)) {
            isLocked = true;
            missingPrereqs.push(prereq.title);
          }
        }
        
        course.dataValues.isLocked = isLocked;
        course.dataValues.missingPrereqs = missingPrereqs;
      }
    }

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

/**
 * GET /api/courses/:id
 * Получение курса по ID
 */
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id, {
      include: [
        { 
          model: User, 
          as: 'author', 
          attributes: ['id', 'username', 'role']
        },
        {
          model: Course,
          as: 'prerequisites',
          attributes: ['id', 'title', 'description'],
          through: { attributes: [] }
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.COURSE_NOT_FOUND
      });
    }

    if (!course.isPublished && 
        req.user.role !== ROLES.METHODIST && 
        req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Курс еще не опубликован'
      });
    }

    if (req.user.role === ROLES.METHODIST && course.authorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Вы можете просматривать только свои курсы'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course by id error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

/**
 * POST /api/courses
 * Создание курса
 */
const createCourse = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      coverImage, 
      content, 
      duration, 
      level, 
      prerequisites 
    } = req.body;

    console.log('📝 Создание курса:');
    console.log('  Название:', title);
    console.log('  Обложка:', coverImage);
    console.log('  Блоков:', content?.length || 0);

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Название и контент курса обязательны'
      });
    }

    const course = await Course.create({
      title,
      description,
      coverImage: coverImage || null,
      content,
      duration: duration || 0,
      level: level || 'BEGINNER',
      authorId: req.user.id,
      isPublished: false
    });

    console.log('✅ Курс создан:', course.id);
    console.log('  Обложка сохранена:', course.coverImage);

    if (prerequisites && prerequisites.length > 0) {
      const prerequisiteRecords = prerequisites.map(prereqId => ({
        courseId: course.id,
        prerequisiteId: prereqId
      }));
      await CoursePrerequisite.bulkCreate(prerequisiteRecords);
    }

    res.status(201).json({
      success: true,
      data: course,
      message: 'Курс успешно создан'
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

/**
 * PUT /api/courses/:id
 * Обновление курса
 */
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      coverImage, 
      content, 
      duration, 
      level, 
      prerequisites 
    } = req.body;

    console.log('📝 Обновление курса:', id);
    console.log('  Новая обложка:', coverImage);

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.COURSE_NOT_FOUND
      });
    }

    if (course.authorId !== req.user.id && req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN
      });
    }

    if (title) course.title = title;
    if (description !== undefined) course.description = description;
    if (coverImage !== undefined) course.coverImage = coverImage;
    if (content) course.content = content;
    if (duration !== undefined) course.duration = duration;
    if (level) course.level = level;

    await course.save();

    console.log('✅ Курс обновлен, обложка:', course.coverImage);

    if (prerequisites) {
      await CoursePrerequisite.destroy({ where: { courseId: id } });
      if (prerequisites.length > 0) {
        const prerequisiteRecords = prerequisites.map(prereqId => ({
          courseId: id,
          prerequisiteId: prereqId
        }));
        await CoursePrerequisite.bulkCreate(prerequisiteRecords);
      }
    }

    res.json({
      success: true,
      data: course,
      message: 'Курс успешно обновлен'
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

/**
 * DELETE /api/courses/:id
 * Удаление курса
 */
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.COURSE_NOT_FOUND
      });
    }

    if (course.authorId !== req.user.id && req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN
      });
    }

    const assignments = await Assignment.count({ where: { courseId: id } });
    if (assignments > 0) {
      return res.status(400).json({
        success: false,
        message: 'Нельзя удалить курс, который уже назначен специалистам'
      });
    }

    await CoursePrerequisite.destroy({ where: { courseId: id } });
    await course.destroy();

    res.json({
      success: true,
      message: 'Курс успешно удален'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

/**
 * PUT /api/courses/:id/publish
 * Публикация курса
 */
const publishCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.COURSE_NOT_FOUND
      });
    }

    if (course.authorId !== req.user.id && req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN
      });
    }

    if (!course.content || !Array.isArray(course.content) || course.content.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Нельзя опубликовать курс без контента. Добавьте хотя бы один блок.'
      });
    }

    course.isPublished = true;
    await course.save();

    res.json({
      success: true,
      data: course,
      message: 'Курс успешно опубликован и доступен для специалистов'
    });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

/**
 * POST /api/courses/:id/assign
 * Назначение курса специалисту
 */
const assignCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialistId, deadline } = req.body;

    if (!specialistId) {
      return res.status(400).json({
        success: false,
        message: 'ID специалиста обязателен'
      });
    }

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.COURSE_NOT_FOUND
      });
    }

    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: 'Нельзя назначить неопубликованный курс'
      });
    }

    const specialist = await User.findByPk(specialistId);
    if (!specialist) {
      return res.status(404).json({
        success: false,
        message: 'Специалист не найден'
      });
    }

    if (specialist.role !== ROLES.SPECIALIST) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь не является специалистом'
      });
    }

    const existingAssignment = await Assignment.findOne({
      where: { 
        courseId: id, 
        specialistId: specialistId 
      }
    });

    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: 'Этот курс уже назначен специалисту'
      });
    }

    const prerequisites = await CoursePrerequisite.findAll({
      where: { courseId: id },
      include: [{ model: Course, as: 'prerequisite' }]
    });

    for (const prereq of prerequisites) {
      const completed = await Assignment.findOne({
        where: {
          courseId: prereq.prerequisiteId,
          specialistId: specialistId,
          status: 'COMPLETED'
        }
      });
      
      if (!completed) {
        return res.status(400).json({
          success: false,
          message: `Необходимо пройти курс: "${prereq.prerequisite.title}"`
        });
      }
    }

    const assignment = await Assignment.create({
      courseId: id,
      specialistId: specialistId,
      assignedBy: req.user.id,
      deadline: deadline || null,
      status: 'ASSIGNED'
    });

    await Progress.create({
      assignmentId: assignment.id,
      completedBlocks: [],
      progressPercent: 0
    });

    res.status(201).json({
      success: true,
      data: assignment,
      message: 'Курс успешно назначен специалисту'
    });
  } catch (error) {
    console.error('Assign course error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

/**
 * GET /api/courses/:id/prerequisites
 * Получение пререквизитов курса с их статусами для пользователя
 */
const getCoursePrerequisites = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const course = await Course.findByPk(id, {
      include: [
        {
          model: Course,
          as: 'prerequisites',
          attributes: ['id', 'title', 'description', 'coverImage', 'level'],
          through: { attributes: [] }
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.COURSE_NOT_FOUND
      });
    }

    const prerequisites = course.prerequisites || [];
    const result = [];

    for (const prereq of prerequisites) {
      const assignment = await Assignment.findOne({
        where: {
          courseId: prereq.id,
          specialistId: userId,
          status: 'COMPLETED'
        }
      });
      
      result.push({
        ...prereq.toJSON(),
        isCompleted: !!assignment
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get prerequisites error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  assignCourse,
  getCoursePrerequisites
};