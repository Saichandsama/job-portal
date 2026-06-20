const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');

const realCompanies = [
    { name: 'Tata Consultancy Services (TCS)', email: 'careers@tcs.com' },
    { name: 'Infosys', email: 'careers@infosys.com' },
    { name: 'Wipro', email: 'careers@wipro.com' },
    { name: 'Flipkart', email: 'careers@flipkart.com' },
    { name: 'Zomato', email: 'careers@zomato.com' },
    { name: 'Swiggy', email: 'careers@swiggy.in' },
    { name: 'Paytm', email: 'careers@paytm.com' },
    { name: 'Razorpay', email: 'jobs@razorpay.com' },
    { name: 'CRED', email: 'careers@cred.club' },
    { name: 'Reliance Industries', email: 'careers@ril.com' }
];

const jobsData = [
    { company: 'Tata Consultancy Services (TCS)', title: 'Systems Engineer', location: 'Pune, Maharashtra', salary: '₹4,00,000 - ₹7,00,000 PA', description: 'Looking for a Systems Engineer with 2+ years of experience in Java, Spring Boot, and Microservices architecture. Must have strong problem-solving skills and the ability to work in a fast-paced environment.' },
    { company: 'Infosys', title: 'Senior Systems Engineer', location: 'Bangalore, Karnataka', salary: '₹6,00,000 - ₹9,00,000 PA', description: 'Seeking a Senior Systems Engineer with deep knowledge of React.js, Node.js, and Cloud deployments (AWS/Azure). Will be responsible for mentoring junior developers and leading module development.' },
    { company: 'Wipro', title: 'Data Analyst', location: 'Hyderabad, Telangana', salary: '₹5,00,000 - ₹8,50,000 PA', description: 'We are hiring a Data Analyst proficient in SQL, Python, and Tableau. The ideal candidate will analyze large datasets to derive business insights for our global clients.' },
    { company: 'Flipkart', title: 'SDE II (Backend)', location: 'Bangalore, Karnataka', salary: '₹25,00,000 - ₹40,00,000 PA', description: 'Join Flipkart\'s core supply chain team! We are looking for an SDE II with strong expertise in Java, Distributed Systems, Kafka, and NoSQL databases to handle scale and high throughput.' },
    { company: 'Zomato', title: 'Frontend Developer', location: 'Gurugram, Haryana', salary: '₹15,00,000 - ₹25,00,000 PA', description: 'Zomato is looking for a passionate Frontend Developer to build seamless user experiences. Requirements: React.js, Redux, TailwindCSS, and an eye for pixel-perfect design.' },
    { company: 'Swiggy', title: 'Product Manager', location: 'Bangalore, Karnataka', salary: '₹20,00,000 - ₹35,00,000 PA', description: 'Seeking an experienced Product Manager to lead our logistics routing product. Must have 4+ years of product management experience in B2C tech companies.' },
    { company: 'Paytm', title: 'Android Developer', location: 'Noida, Uttar Pradesh', salary: '₹12,00,000 - ₹20,00,000 PA', description: 'Paytm is looking for an Android Developer experienced with Kotlin, Coroutines, and MVVM architecture. You will be working on our core payments module.' },
    { company: 'Razorpay', title: 'Security Engineer', location: 'Bangalore, Karnataka', salary: '₹18,00,000 - ₹30,00,000 PA', description: 'Looking for a Security Engineer to conduct penetration testing, vulnerability assessments, and secure code reviews for our financial infrastructure.' },
    { company: 'CRED', title: 'iOS Developer', location: 'Bangalore, Karnataka', salary: '₹22,00,000 - ₹40,00,000 PA', description: 'Join CRED to build beautiful iOS applications! Experience in Swift, UI/UX animations, and a strong portfolio of published apps is required.' },
    { company: 'Reliance Industries', title: 'DevOps Engineer', location: 'Navi Mumbai, Maharashtra', salary: '₹10,00,000 - ₹18,00,000 PA', description: 'Hiring a DevOps Engineer for Jio platforms. Must be skilled in Kubernetes, Docker, Jenkins, and infrastructure as code (Terraform).' },
    { company: 'Tata Consultancy Services (TCS)', title: 'Cloud Architect', location: 'Chennai, Tamil Nadu', salary: '₹15,00,000 - ₹25,00,000 PA', description: 'Seeking a Cloud Architect with AWS/GCP certification to design scalable enterprise solutions for international clients.' },
    { company: 'Infosys', title: 'Machine Learning Engineer', location: 'Pune, Maharashtra', salary: '₹12,00,000 - ₹22,00,000 PA', description: 'Looking for an ML Engineer to build predictive models. Required: Python, TensorFlow/PyTorch, and experience with NLP or Computer Vision.' },
    { company: 'Zomato', title: 'Data Scientist', location: 'Gurugram, Haryana', salary: '₹18,00,000 - ₹30,00,000 PA', description: 'Join our data science team to optimize food delivery times using advanced machine learning algorithms and spatial data analysis.' },
    { company: 'Flipkart', title: 'Business Analyst', location: 'Bangalore, Karnataka', salary: '₹10,00,000 - ₹16,00,000 PA', description: 'Looking for a business analyst to work closely with category managers. Strong SQL and Excel skills required.' }
];

async function seed() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    console.log('Clearing old data...');
    await db.exec('DELETE FROM applications; DELETE FROM jobs; DELETE FROM users;');

    console.log('Seeding Real Indian Companies (Employers)...');
    const hash = await bcrypt.hash('password123', 10);
    
    const companyIdMap = {};

    for (const company of realCompanies) {
        const result = await db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'employer')`, [company.name, company.email, hash]);
        companyIdMap[company.name] = result.lastID;
    }

    console.log('Seeding Jobs for Real Companies...');
    for (const job of jobsData) {
        const employerId = companyIdMap[job.company];
        await db.run(
            `INSERT INTO jobs (employer_id, title, description, location, salary) VALUES (?, ?, ?, ?, ?)`, 
            [employerId, job.title, job.description, job.location, job.salary]
        );
    }

    console.log('Seeding a Test Student Account...');
    const candResult = await db.run(`INSERT INTO users (name, email, password, role) VALUES ('Rahul Kumar', 'student@india.com', ?, 'candidate')`, hash);

    console.log('Database seeded with real Indian company data successfully!');
    await db.close();
}

seed().catch(console.error);
