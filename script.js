// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // Spice Particles Canvas
    const canvas = document.getElementById('spiceParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = document.getElementById('heroSection').offsetHeight;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * height; // initial random spread over the screen
            }
            
            reset() {
                // Start from the bottom middle/right where the action is
                this.x = (Math.random() * width * 0.8) + width * 0.1; 
                this.y = height + 20;
                
                // Define ingredient types and probabilities
                const types = [
                    { type: 'dust', color: '#ea580c', prob: 20 }, // Turmeric masala
                    { type: 'dust', color: '#dc2626', prob: 20 }, // Chili powder masala
                    { type: 'dust', color: '#78350f', prob: 15 }, // Garam masala
                    { type: 'peppercorn', color: '#1a1817', prob: 15 }, // Black pepper
                    { type: 'clove', color: '#3e1a0b', prob: 10 }, // Grampoo (Cloves)
                    { type: 'leaf', color: '#166534', prob: 10 }, // Curry leaves
                    { type: 'flake', color: '#b91c1c', prob: 5 }, // Chili flakes
                    { type: 'chunk', color: '#290e02', prob: 5 } // Smoked beef
                ];
                
                let rand = Math.random() * 100;
                let sum = 0;
                let selected = types[0];
                for (let t of types) {
                    sum += t.prob;
                    if (rand <= sum) {
                        selected = t;
                        break;
                    }
                }
                
                this.type = selected.type;
                this.color = selected.color;
                
                // Set sizes based on ingredient type - making them slightly larger to be visible
                if (this.type === 'dust') this.size = Math.random() * 2 + 1.5;
                else if (this.type === 'peppercorn') this.size = Math.random() * 3.5 + 2;
                else if (this.type === 'clove') this.size = Math.random() * 4 + 3;
                else if (this.type === 'flake') this.size = Math.random() * 3 + 2;
                else if (this.type === 'leaf') this.size = Math.random() * 8 + 5;
                else if (this.type === 'chunk') this.size = Math.random() * 10 + 6;
                
                this.speedY = (Math.random() * -5) - 2; // moving up faster
                this.speedX = (Math.random() * 6) - 3; // drifting sideways wider
                
                this.opacity = Math.random() * 0.9 + 0.1;
                this.blur = Math.random() > 0.6 ? Math.random() * 4 : 0; // Depth of field blur
                
                // Rotation
                this.angle = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.2;
            }
            
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                
                // Add slight wandering (air resistance/turbulence)
                this.speedX += (Math.random() * 0.2) - 0.1;
                this.angle += this.rotationSpeed;
                
                // Fade out near the top
                if (this.y < height * 0.2) {
                    this.opacity -= 0.01;
                }
                
                // Reset if off-screen or invisible
                if (this.y < -30 || this.x < -30 || this.x > width + 30 || this.opacity <= 0) {
                    this.reset();
                }
            }
            
            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.opacity);
                ctx.fillStyle = this.color;
                
                // Apply rotation and position
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                
                if (this.blur > 0) {
                    ctx.shadowBlur = this.blur * 5;
                    ctx.shadowColor = this.color;
                }
                
                ctx.beginPath();
                
                // Draw different shapes based on ingredient type
                if (this.type === 'dust' || this.type === 'peppercorn') {
                    // Simple circles
                    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                } else if (this.type === 'clove') {
                    // Grampoo (Clove) shape: stick with a bulb
                    ctx.moveTo(-this.size * 0.2, -this.size);
                    ctx.lineTo(this.size * 0.2, -this.size);
                    ctx.lineTo(this.size * 0.3, this.size * 0.2);
                    ctx.lineTo(-this.size * 0.3, this.size * 0.2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(0, this.size * 0.4, this.size * 0.6, 0, Math.PI * 2); // main bulb
                } else if (this.type === 'flake') {
                    // Irregular polygon for chili flakes
                    ctx.moveTo(0, -this.size);
                    ctx.lineTo(this.size * 0.8, -this.size * 0.2);
                    ctx.lineTo(this.size * 0.5, this.size);
                    ctx.lineTo(-this.size * 0.6, this.size * 0.8);
                    ctx.lineTo(-this.size, -this.size * 0.3);
                } else if (this.type === 'leaf') {
                    // Curry leaf shape (bezier curves)
                    ctx.moveTo(0, -this.size);
                    ctx.quadraticCurveTo(this.size * 1.5, 0, 0, this.size);
                    ctx.quadraticCurveTo(-this.size * 1.5, 0, 0, -this.size);
                } else if (this.type === 'chunk') {
                    // Beef chunk (larger irregular polygon)
                    ctx.moveTo(0, -this.size);
                    ctx.lineTo(this.size * 0.9, -this.size * 0.5);
                    ctx.lineTo(this.size, this.size * 0.6);
                    ctx.lineTo(this.size * 0.2, this.size * 0.9);
                    ctx.lineTo(-this.size * 0.8, this.size * 0.7);
                    ctx.lineTo(-this.size * 1.1, -this.size * 0.2);
                }
                
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Initialize particles
        const particleCount = window.innerWidth > 768 ? 150 : 60;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
    }
<<<<<<< HEAD

    // Parallax effect for video background
=======
    
    // Parallax effect for 3D frames
>>>>>>> a4ec989718a7b9d4b30ef3b831c30980c3854bd8
    const heroSection = document.getElementById('heroSection');
    const centerFrame = document.querySelector('.center-frame');
    const leftFrame = document.querySelector('.left-frame');
    const rightFrame = document.querySelector('.right-frame');
    
    if (heroSection && centerFrame && leftFrame && rightFrame) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate movement percentages (-1 to 1)
            const moveX = (x - centerX) / centerX;
            const moveY = (y - centerY) / centerY;
            
            // Apply 3D transforms with different intensities for depth
            centerFrame.style.transform = `translate(${moveX * -10}px, calc(-20px + ${moveY * -10}px)) perspective(1000px) rotateY(${moveX * 5}deg) rotateX(${moveY * -5}deg)`;
            
            // Side frames move more for parallax depth
            leftFrame.style.transform = `rotate(-8deg) translate(${moveX * 30}px, ${moveY * 30}px) perspective(1000px) rotateY(${moveX * 15}deg)`;
            
            rightFrame.style.transform = `rotate(12deg) translate(${moveX * -25}px, ${moveY * -25}px) perspective(1000px) rotateY(${moveX * 15}deg)`;
        });
        
        heroSection.addEventListener('mouseleave', () => {
            // Reset transforms with smooth transitions
            centerFrame.style.transition = 'transform 0.5s ease';
            leftFrame.style.transition = 'transform 0.5s ease';
            rightFrame.style.transition = 'transform 0.5s ease';
            
            centerFrame.style.transform = `translate(0px, -20px) perspective(1000px) rotateY(0deg) rotateX(0deg)`;
            leftFrame.style.transform = `rotate(-8deg) translate(0px, 0px) perspective(1000px) rotateY(0deg)`;
            rightFrame.style.transform = `rotate(12deg) translate(0px, 0px) perspective(1000px) rotateY(0deg)`;
            
            // Remove transition after reset so mousemove is snappy
            setTimeout(() => {
                if(centerFrame) centerFrame.style.transition = 'none';
                if(leftFrame) leftFrame.style.transition = 'none';
                if(rightFrame) rightFrame.style.transition = 'none';
            }, 500);
        });
        
        // Ensure snappy movement initially
        centerFrame.style.transition = 'none';
        leftFrame.style.transition = 'none';
        rightFrame.style.transition = 'none';
    }
});
