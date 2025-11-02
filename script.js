// IQ Test Data
const testData = {
    questions: [
        {
            id: 1,
            category: "Logical Reasoning",
            question: "Which number comes next in the sequence: 2, 4, 8, 16, ?",
            options: ["24", "32", "20", "18"],
            correct: 1,
            explanation: "Each number is multiplied by 2 (powers of 2: 2¹, 2², 2³, 2⁴, 2⁵)"
        },
        {
            id: 2,
            category: "Pattern Recognition",
            question: "Complete the pattern: 🌙, 🌙🌙, 🌙🌙🌙, ?",
            options: ["🌙🌙", "🌙🌙🌙🌙", "🌞", "⭐"],
            correct: 1,
            explanation: "The pattern increases by one moon each time"
        },
        {
            id: 3,
            category: "Verbal Reasoning",
            question: "Which word is the odd one out?",
            options: ["Apple", "Banana", "Carrot", "Orange"],
            correct: 2,
            explanation: "Carrot is a vegetable, others are fruits"
        },
        {
            id: 4,
            category: "Mathematical",
            question: "If all Bloops are Razzles and all Razzles are Lazzles, then all Bloops are definitely what?",
            options: ["Razzles", "Lazzles", "Neither", "Both"],
            correct: 1,
            explanation: "Transitive property: Bloops → Razzles → Lazzles"
        },
        {
            id: 5,
            category: "Spatial Reasoning",
            question: "If you fold a square paper diagonally twice, what shape do you get?",
            options: ["Rectangle", "Triangle", "Smaller Square", "Circle"],
            correct: 1,
            explanation: "Folding diagonally twice creates a triangle"
        }
    ],
    currentQuestion: 0,
    answers: [],
    startTime: null,
    timer: null
};

// User results
let userResults = {
    totalScore: 0,
    iqScore: 100,
    category: "Average",
    percentile: 50,
    strengths: {
        "Logical Reasoning": 0,
        "Pattern Recognition": 0,
        "Verbal Reasoning": 0,
        "Mathematical": 0,
        "Spatial Reasoning": 0
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add parallax effect to hero section
    window.addEventListener('scroll', handleParallax);
    
    // Initialize floating animations
    initializeFloatingElements();
}

function initializeFloatingElements() {
    const floatingItems = document.querySelectorAll('.floating-item');
    floatingItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.5}s`;
    });
}

function handleParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}

function startTest() {
    // Hide all sections except test interface
    document.getElementById('home').style.display = 'none';
    document.getElementById('test').style.display = 'none';
    document.querySelector('.features').style.display = 'none';
    document.getElementById('test-interface').style.display = 'block';
    
    // Initialize test
    testData.currentQuestion = 0;
    testData.answers = [];
    testData.startTime = Date.now();
    
    // Start timer
    startTimer();
    
    // Load first question
    loadQuestion();
    
    // Update progress
    updateProgress();
    
    // Smooth scroll to test interface
    document.getElementById('test-interface').scrollIntoView({ behavior: 'smooth' });
}

function startTimer() {
    let timeLeft = 120; // 2 minutes per question
    
    testData.timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timerElement = document.getElementById('timer');
        
        if (timerElement) {
            timerElement.textContent = `⏱️ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 30) {
                timerElement.style.color = 'var(--error)';
            }
            
            if (timeLeft <= 0) {
                clearInterval(testData.timer);
                autoAdvance();
            }
        }
    }, 1000);
}

function loadQuestion() {
    const question = testData.questions[testData.currentQuestion];
    
    // Update question info
    document.getElementById('category-tag').textContent = question.category;
    document.getElementById('question-text').textContent = question.question;
    
    // Load question content
    const contentDiv = document.getElementById('question-content');
    contentDiv.innerHTML = '';
    
    // Load answer options
    const optionsDiv = document.getElementById('answer-options');
    optionsDiv.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.onclick = () => selectAnswer(index);
        button.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-content">${option}</span>
        `;
        optionsDiv.appendChild(button);
    });
    
    // Reset next button
    document.getElementById('next-btn').disabled = true;
    document.getElementById('next-btn').textContent = testData.currentQuestion === testData.questions.length - 1 ? 'Finish' : 'Next';
}

function selectAnswer(answerIndex) {
    // Remove previous selections
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Mark selected answer
    document.querySelectorAll('.option-btn')[answerIndex].classList.add('selected');
    
    // Store answer
    testData.answers[testData.currentQuestion] = answerIndex;
    
    // Enable next button
    document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
    if (testData.currentQuestion < testData.questions.length - 1) {
        testData.currentQuestion++;
        loadQuestion();
        updateProgress();
        resetTimer();
    } else {
        finishTest();
    }
}

function previousQuestion() {
    if (testData.currentQuestion > 0) {
        testData.currentQuestion--;
        loadQuestion();
        updateProgress();
        resetTimer();
    }
}

function resetTimer() {
    clearInterval(testData.timer);
    startTimer();
}

function updateProgress() {
    const progress = ((testData.currentQuestion + 1) / testData.questions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `Question ${testData.currentQuestion + 1} of ${testData.questions.length}`;
}

function autoAdvance() {
    // If no answer selected, mark as -1 (unanswered)
    if (testData.answers[testData.currentQuestion] === undefined) {
        testData.answers[testData.currentQuestion] = -1;
    }
    
    // Auto advance to next question or finish
    if (testData.currentQuestion < testData.questions.length - 1) {
        nextQuestion();
    } else {
        finishTest();
    }
}

function finishTest() {
    clearInterval(testData.timer);
    
    // Calculate results
    calculateResults();
    
    // Show results
    showResults();
}

function calculateResults() {
    let correctAnswers = 0;
    const categoryScores = {};
    
    // Initialize category scores
    Object.keys(userResults.strengths).forEach(category => {
        categoryScores[category] = { correct: 0, total: 0 };
    });
    
    // Calculate scores
    testData.questions.forEach((question, index) => {
        const userAnswer = testData.answers[index];
        categoryScores[question.category].total++;
        
        if (userAnswer === question.correct) {
            correctAnswers++;
            categoryScores[question.category].correct++;
        }
    });
    
    // Calculate IQ score (simplified formula)
    userResults.totalScore = correctAnswers;
    userResults.iqScore = Math.round(100 + (correctAnswers - testData.questions.length / 2) * 10);
    
    // Determine category
    if (userResults.iqScore >= 130) userResults.category = "Very Superior";
    else if (userResults.iqScore >= 120) userResults.category = "Superior";
    else if (userResults.iqScore >= 110) userResults.category = "High Average";
    else if (userResults.iqScore >= 90) userResults.category = "Average";
    else if (userResults.iqScore >= 80) userResults.category = "Low Average";
    else userResults.category = "Borderline";
    
    // Calculate percentile (simplified)
    userResults.percentile = Math.round(50 + (userResults.iqScore - 100) * 2);
    
    // Calculate category strengths
    Object.keys(categoryScores).forEach(category => {
        const score = categoryScores[category];
        userResults.strengths[category] = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    });
}

function showResults() {
    // Hide test interface
    document.getElementById('test-interface').style.display = 'none';
    
    // Show results
    document.getElementById('results').style.display = 'block';
    
    // Update results display
    document.getElementById('score-number').textContent = userResults.iqScore;
    document.getElementById('score-category').textContent = userResults.category;
    document.getElementById('score-percentile').textContent = `You're in the top ${100 - userResults.percentile}% of test takers!`;
    
    // Update score circle
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (userResults.iqScore / 200) * circumference;
    document.getElementById('score-circle').style.strokeDashoffset = offset;
    
    // Load skills breakdown
    loadSkillsBreakdown();
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

function loadSkillsBreakdown() {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';
    
    Object.entries(userResults.strengths).forEach(([skill, percentage]) => {
        const skillBar = document.createElement('div');
        skillBar.className = 'skill-bar';
        skillBar.innerHTML = `
            <div class="skill-info">
                <span>${skill}</span>
                <span>${percentage}%</span>
            </div>
            <div class="skill-progress">
                <div class="skill-fill" style="width: 0%"></div>
            </div>
        `;
        container.appendChild(skillBar);
        
        // Animate the fill
        setTimeout(() => {
            skillBar.querySelector('.skill-fill').style.width = `${percentage}%`;
        }, 100);
    });
}

function downloadReport() {
    // Create a simple PDF report (in a real app, you'd use a library like jsPDF)
    const report = `
BRAINBLOOM IQ TEST REPORT
=========================

Test Date: ${new Date().toLocaleDateString()}
Test Duration: ${Math.round((Date.now() - testData.startTime) / 1000 / 60)} minutes

YOUR RESULTS:
------------
IQ Score: ${userResults.iqScore}
Category: ${userResults.category}
Percentile: Top ${100 - userResults.percentile}%

COGNITIVE STRENGTHS:
-------------------
${Object.entries(userResults.strengths).map(([skill, percentage]) => 
    `${skill}: ${percentage}%`).join('\n')}

RECOMMENDATIONS:
---------------
Based on your results, we recommend:
${userResults.iqScore >= 120 ? "• Explore advanced learning opportunities\n• Consider challenging academic programs" : ""}
${userResults.strengths["Logical Reasoning"] >= 80 ? "• Pursue careers in STEM fields\n• Develop problem-solving skills" : ""}
${userResults.strengths["Verbal Reasoning"] >= 80 ? "• Consider writing or communication careers\n• Explore language learning" : ""}

Thank you for using BrainBloom!
    `;
    
    // Download as text file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brainbloom-iq-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'My BrainBloom IQ Test Results',
            text: `I scored ${userResults.iqScore} on the BrainBloom IQ test! That's ${userResults.category} level. Try it yourself!`,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const text = `I scored ${userResults.iqScore} on the BrainBloom IQ test! That's ${userResults.category} level. Try it yourself at ${window.location.href}`;
        navigator.clipboard.writeText(text).then(() => {
            alert('Results copied to clipboard! Share them with your friends.');
        });
    }
}

function retakeTest() {
    // Reset everything
    testData.currentQuestion = 0;
    testData.answers = [];
    testData.startTime = null;
    
    // Hide results
    document.getElementById('results').style.display = 'none';
    
    // Show home section
    document.getElementById('home').style.display = 'block';
    document.querySelector('.features').style.display = 'block';
    document.getElementById('test').style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.feature-card, .question-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
});

// Reset transform on mouse leave
document.addEventListener('mouseleave', () => {
    const cards = document.querySelectorAll('.feature-card, .question-card');
    cards.forEach(card => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});
