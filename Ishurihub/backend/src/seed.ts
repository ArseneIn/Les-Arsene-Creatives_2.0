import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { School } from './schools/entities/school.entity';
import { AcademicYear } from './academic-years/entities/academic-year.entity';
import { Term } from './academic-years/entities/term.entity';
import { Role } from './roles/entities/role.entity';
import { Student } from './students/entities/student.entity';
import { HolidayCourse } from './holiday-lms/entities/holiday-course.entity';
import { Activity, ActivityType } from './holiday-lms/entities/activity.entity';
import { QuizQuestion } from './holiday-lms/entities/quiz-question.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '1',
    database: process.env.DB_NAME || 'ishurihub',
    entities: [
      User,
      School,
      AcademicYear,
      Term,
      Role,
      Student,
      HolidayCourse,
      Activity,
      QuizQuestion,
    ],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('Data Source has been initialized!');

  const userRepository = dataSource.getRepository(User);
  const schoolRepository = dataSource.getRepository(School);
  const yearRepository = dataSource.getRepository(AcademicYear);
  const termRepository = dataSource.getRepository(Term);
  const studentRepository = dataSource.getRepository(Student);
  const courseRepository = dataSource.getRepository(HolidayCourse);
  const activityRepository = dataSource.getRepository(Activity);
  const questionRepository = dataSource.getRepository(QuizQuestion);

  // 1. Create a School
  let school = await schoolRepository.findOne({
    where: { name: 'Bright Future Academy' },
  });
  if (!school) {
    school = schoolRepository.create({
      name: 'Bright Future Academy',
      motto: 'Knowledge is Light',
      location: 'Kigali, Rwanda',
      email: 'info@brightfuture.rw',
      phone: '+250788123456',
      plan: 'Professional',
      subscriptionStatus: 'Active',
    });
    school = await schoolRepository.save(school);
    console.log('Seeded school: Bright Future Academy');
  }

  // 2. Create Academic Year
  let year = await yearRepository.findOne({
    where: { schoolId: school.id, isActive: true },
  });
  if (!year) {
    year = yearRepository.create({
      name: '2024-2025',
      startDate: '2024-09-01',
      endDate: '2025-07-15',
      isActive: true,
      schoolId: school.id,
    });
    year = await yearRepository.save(year);
    console.log('Seeded academic year: 2024-2025');
  }

  // 3. Create Term
  let term = await termRepository.findOne({
    where: { academicYearId: year.id, isActive: true },
  });
  if (!term) {
    term = termRepository.create({
      name: 'Term 1',
      startDate: '2024-09-01',
      endDate: '2024-12-20',
      isActive: true,
      academicYearId: year.id,
    });
    term = await termRepository.save(term);
    console.log('Seeded term: Term 1');
  }

  // 4. Create Users
  const password = await bcrypt.hash('password123', 10);

  const testUsers = [
    {
      email: 'admin@ishurihub.rw',
      name: 'Super Admin',
      roleId: 'super_admin',
      schoolId: school.id,
    },
    {
      email: 'school@ishurihub.rw',
      name: 'School Admin',
      roleId: 'school_admin',
      schoolId: school.id,
    },

    {
      email: 'teacher@ishurihub.rw',
      name: 'Jean Teacher',
      roleId: 'teacher',
      schoolId: school.id,
    },
    {
      email: 'student@ishurihub.rw',
      name: 'Alex Student',
      roleId: 'student',
      schoolId: school.id,
    },
    {
      email: 'parent@ishurihub.rw',
      name: 'Marie Parent',
      roleId: 'parent',
      schoolId: school.id,
    },
  ];

  for (const u of testUsers) {
    let user = await userRepository.findOne({ where: { email: u.email } });
    if (!user) {
      user = userRepository.create({
        ...u,
        password,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`,
      });
      user = await userRepository.save(user);
      console.log(`Seeded user: ${u.email} (${u.roleId})`);

      // If it's a student, also create the Student record
      if (u.roleId === 'student') {
        const student = studentRepository.create({
          id: user.id,
          name: u.name,
          email: u.email,
          studentId: '2024-0001',
          grade: 'S3',
          schoolId: school.id,
          gender: 'Male',
          status: 'Active',
          avatarUrl: user.avatarUrl,
        });
        await studentRepository.save(student);
        console.log(`Seeded Student record for Alex`);
      }
    }
  }

  // 5. Create Holiday Course for S3
  let course = await courseRepository.findOne({
    where: { schoolId: school.id, grade: 'S3', title: 'Mathematics Refresher' },
  });
  if (!course) {
    course = courseRepository.create({
      title: 'Mathematics Refresher',
      description: 'Prepare for the next term with these core math concepts.',
      schoolId: school.id,
      grade: 'S3',
    });
    course = await courseRepository.save(course);
    console.log('Seeded Holiday Course: Mathematics Refresher');

    // Add Activities
    const activities = [
      {
        title: 'Introduction to Algebra',
        type: ActivityType.READING,
        content:
          '# Algebra Foundations\n\nAlgebra is the part of mathematics that helps represent problems or situations in the form of mathematical expressions.',
        orderIndex: 0,
        courseId: course.id,
      },
      {
        title: 'Solving Linear Equations',
        type: ActivityType.VIDEO,
        content: 'https://www.youtube.com/embed/l3XzepN03KQ',
        orderIndex: 1,
        courseId: course.id,
      },
      {
        title: 'Mid-Course Quiz',
        type: ActivityType.QUIZ,
        content: 'Test your knowledge of the first two lessons.',
        orderIndex: 2,
        courseId: course.id,
      },
    ];

    for (const act of activities) {
      const savedAct = await activityRepository.save(
        activityRepository.create(act),
      );

      if (act.type === ActivityType.QUIZ) {
        const questions = [
          {
            text: 'What is the value of x in 2x = 10?',
            options: ['2', '5', '10', '20'],
            correctAnswer: '5',
            points: 5,
            activityId: savedAct.id,
          },
          {
            text: 'If x + 5 = 12, then x is?',
            options: ['5', '7', '12', '17'],
            correctAnswer: '7',
            points: 5,
            activityId: savedAct.id,
          },
        ];
        await questionRepository.save(questionRepository.create(questions));
      }
    }
    console.log('Seeded activities for Math course');
  }

  await dataSource.destroy();
  console.log('Seeding completed successfully!');
}

seed().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
