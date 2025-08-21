// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');

// US State Codes Mapping
const US_STATES = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
    'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
    'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
};

// Popular US Cities to State Mapping
const CITY_TO_STATE = {
    // California
    'Mountain View': 'CA', 'Los Angeles': 'CA', 'San Francisco': 'CA', 'San Diego': 'CA', 'Sacramento': 'CA',
    'Oakland': 'CA', 'Fresno': 'CA', 'Long Beach': 'CA', 'Santa Ana': 'CA', 'Anaheim': 'CA',
    'Bakersfield': 'CA', 'Riverside': 'CA', 'Stockton': 'CA', 'Irvine': 'CA', 'Fremont': 'CA',
    
    // Washington
    'Seattle': 'WA', 'Spokane': 'WA', 'Tacoma': 'WA', 'Vancouver': 'WA', 'Bellevue': 'WA',
    'Kent': 'WA', 'Everett': 'WA', 'Renton': 'WA', 'Yakima': 'WA', 'Federal Way': 'WA',
    
    // New York
    'New York': 'NY', 'Buffalo': 'NY', 'Rochester': 'NY', 'Yonkers': 'NY', 'Syracuse': 'NY',
    'Albany': 'NY', 'New Rochelle': 'NY', 'Mount Vernon': 'NY', 'Schenectady': 'NY', 'Utica': 'NY',
    'NYC': 'NY', 'Manhattan': 'NY', 'Brooklyn': 'NY', 'Queens': 'NY', 'Bronx': 'NY',
    
    // Texas
    'Austin': 'TX', 'Houston': 'TX', 'Dallas': 'TX', 'San Antonio': 'TX', 'Fort Worth': 'TX',
    'El Paso': 'TX', 'Arlington': 'TX', 'Corpus Christi': 'TX', 'Plano': 'TX', 'Laredo': 'TX',
    
    // Florida
    'Miami': 'FL', 'Tampa': 'FL', 'Orlando': 'FL', 'Jacksonville': 'FL', 'St. Petersburg': 'FL',
    'Hialeah': 'FL', 'Tallahassee': 'FL', 'Fort Lauderdale': 'FL', 'Port St. Lucie': 'FL', 'Pembroke Pines': 'FL',
    
    // Illinois
    'Chicago': 'IL', 'Aurora': 'IL', 'Rockford': 'IL', 'Joliet': 'IL', 'Naperville': 'IL',
    'Springfield': 'IL', 'Peoria': 'IL', 'Elgin': 'IL', 'Waukegan': 'IL', 'Cicero': 'IL',
    
    // Massachusetts
    'Boston': 'MA', 'Worcester': 'MA', 'Springfield': 'MA', 'Lowell': 'MA', 'Cambridge': 'MA',
    'New Bedford': 'MA', 'Brockton': 'MA', 'Quincy': 'MA', 'Lynn': 'MA', 'Fall River': 'MA',
    
    // New Jersey
    'Newark': 'NJ', 'Jersey City': 'NJ', 'Paterson': 'NJ', 'Elizabeth': 'NJ', 'Edison': 'NJ',
    'Woodbridge': 'NJ', 'Lakewood': 'NJ', 'Toms River': 'NJ', 'Hamilton': 'NJ', 'Trenton': 'NJ',
    
    // Georgia
    'Atlanta': 'GA', 'Augusta': 'GA', 'Columbus': 'GA', 'Savannah': 'GA', 'Athens': 'GA',
    'Sandy Springs': 'GA', 'Roswell': 'GA', 'Macon': 'GA', 'Johns Creek': 'GA', 'Albany': 'GA',
    
    // Pennsylvania
    'Philadelphia': 'PA', 'Pittsburgh': 'PA', 'Allentown': 'PA', 'Erie': 'PA', 'Reading': 'PA',
    'Scranton': 'PA', 'Bethlehem': 'PA', 'Lancaster': 'PA', 'Harrisburg': 'PA', 'Altoona': 'PA',
    
    // Colorado
    'Denver': 'CO', 'Colorado Springs': 'CO', 'Aurora': 'CO', 'Fort Collins': 'CO', 'Lakewood': 'CO',
    'Thornton': 'CO', 'Arvada': 'CO', 'Westminster': 'CO', 'Pueblo': 'CO', 'Centennial': 'CO',
    
    // Arizona
    'Phoenix': 'AZ', 'Tucson': 'AZ', 'Mesa': 'AZ', 'Chandler': 'AZ', 'Glendale': 'AZ',
    'Scottsdale': 'AZ', 'Gilbert': 'AZ', 'Tempe': 'AZ', 'Peoria': 'AZ', 'Surprise': 'AZ'
};

// Initialize address functionality
function initializeAddressFunctionality() {
    const cityInput = document.getElementById('cityInput');
    const stateInput = document.getElementById('stateInput');
    const citySuggestions = document.getElementById('citySuggestions');
    let selectedIndex = -1;
    
    if (!cityInput || !stateInput || !citySuggestions) return;
    
    // City input event handlers
    cityInput.addEventListener('input', function() {
        const value = this.value.trim();
        if (value.length < 2) {
            citySuggestions.style.display = 'none';
            return;
        }
        
        // Find matching cities
        const matches = Object.keys(CITY_TO_STATE).filter(city => 
            city.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 8); // Limit to 8 suggestions
        
        if (matches.length > 0) {
            showCitySuggestions(matches, citySuggestions);
        } else {
            citySuggestions.style.display = 'none';
        }
        
        // Auto-populate state if exact match found
        const exactMatch = Object.keys(CITY_TO_STATE).find(city => 
            city.toLowerCase() === value.toLowerCase()
        );
        if (exactMatch) {
            stateInput.value = CITY_TO_STATE[exactMatch];
        }
    });
    
    // Handle keyboard navigation in suggestions
    cityInput.addEventListener('keydown', function(e) {
        const suggestions = citySuggestions.querySelectorAll('.city-suggestion');
        if (suggestions.length === 0) return;
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
                updateHighlight(suggestions);
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                updateHighlight(suggestions);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    selectCity(suggestions[selectedIndex].textContent.split(',')[0]);
                }
                break;
            case 'Escape':
                citySuggestions.style.display = 'none';
                selectedIndex = -1;
                break;
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!cityInput.contains(e.target) && !citySuggestions.contains(e.target)) {
            citySuggestions.style.display = 'none';
            selectedIndex = -1;
        }
    });
    
    function showCitySuggestions(cities, container) {
        container.innerHTML = '';
        selectedIndex = -1;
        
        cities.forEach(city => {
            const suggestion = document.createElement('div');
            suggestion.className = 'city-suggestion';
            suggestion.textContent = `${city}, ${CITY_TO_STATE[city]}`;
            suggestion.addEventListener('click', () => selectCity(city));
            container.appendChild(suggestion);
        });
        
        container.style.display = 'block';
    }
    
    function updateHighlight(suggestions) {
        suggestions.forEach((suggestion, index) => {
            suggestion.classList.toggle('highlighted', index === selectedIndex);
        });
    }
    
    function selectCity(city) {
        cityInput.value = city;
        stateInput.value = CITY_TO_STATE[city];
        citySuggestions.style.display = 'none';
        selectedIndex = -1;
    }
}

if (contactForm) {
    // Initialize address functionality
    initializeAddressFunctionality();
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const street = formData.get('street');
        const city = formData.get('city');
        const state = formData.get('state');
        const zip = formData.get('zip');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            alert('कृपया सभी आवश्यक फील्ड भरें। (Please fill in all required fields.)');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('कृपया एक मान्य ईमेल पता दर्ज करें। (Please enter a valid email address.)');
            return;
        }
        
        // ZIP code validation (if provided)
        if (zip && !/^[0-9]{5}(-[0-9]{4})?$/.test(zip)) {
            alert('कृपया एक मान्य ZIP कोड दर्ज करें। (Please enter a valid ZIP code.)');
            return;
        }
        
        // State code validation (if provided)
        if (state && !/^[A-Z]{2}$/.test(state)) {
            alert('कृपया एक मान्य 2-अक्षर का राज्य कोड दर्ज करें। (Please enter a valid 2-letter state code.)');
            return;
        }
        
        // Simulate form submission (replace with actual form handling)
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'भेजा जा रहा है... (Sending...)';
        submitBtn.disabled = true;
        
        // Show address details in confirmation if provided
        let addressText = '';
        if (street || city || state || zip) {
            const addressParts = [street, `${city}, ${state}`, zip].filter(part => part);
            addressText = `\nपता (Address): ${addressParts.join(' ')}`;
        }
        
        // Simulate API call
        setTimeout(() => {
            alert(`आपके संदेश के लिए धन्यवाद! मैं जल्द ही आपसे संपर्क करूंगा।\n(Thank you for your message! I will get back to you soon.)${addressText}`);
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .blog-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing animation for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
});

// Project filter functionality (if needed)
function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    
    projects.forEach(project => {
        if (category === 'all' || project.dataset.category === category) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading animation
const style = document.createElement('style');
style.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #2563eb;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: 'Loading...';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 1.5rem;
        font-weight: 600;
        z-index: 10000;
    }
`;
document.head.appendChild(style);

// Add scroll to top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    font-size: 1.2rem;
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effects for project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add skill progress animation
function animateSkillProgress() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach((category, index) => {
        setTimeout(() => {
            category.style.transform = 'translateY(0)';
            category.style.opacity = '1';
        }, index * 200);
    });
}

// Trigger skill animation when skills section is visible
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillProgress();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    skillsObserver.observe(skillsSection);
}

// Add particle effect to hero section (optional)
function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        animation: float-particle 6s linear infinite;
    `;
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    
    document.querySelector('.hero').appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 6000);
}

// Add particle animation CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float-particle {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Create particles periodically
setInterval(createParticle, 3000);

// Add counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat h4');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when about section is visible
const aboutSection = document.querySelector('.about');
if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    aboutObserver.observe(aboutSection);
}