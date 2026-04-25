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

    // Spice Particle System (Authentic Ingredients)
    const canvas = document.getElementById('spiceParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        // Define Spice Types (SVGs drawn to off-screen canvases)
        const spiceTypes = [
            { name: 'curry_leaf', color: '#4d7c0f', shape: 'leaf' },
            { name: 'pepper', color: '#1a1a1a', shape: 'circle' },
            { name: 'chili', color: '#b91c1c', shape: 'flake' },
            { name: 'turmeric', color: '#f59e0b', shape: 'grain' }
        ];

        const spiceImages = [];

        function createSpiceIcons() {
            spiceTypes.forEach(spice => {
                const sCanvas = document.createElement('canvas');
                sCanvas.width = 40;
                sCanvas.height = 40;
                const sCtx = sCanvas.getContext('2d');

                sCtx.fillStyle = spice.color;
                
                if (spice.shape === 'leaf') {
                    // Draw a curry leaf shape
                    sCtx.beginPath();
                    sCtx.moveTo(20, 5);
                    sCtx.quadraticCurveTo(35, 20, 20, 35);
                    sCtx.quadraticCurveTo(5, 20, 20, 5);
                    sCtx.fill();
                    // Stem/Vein
                    sCtx.strokeStyle = 'rgba(255,255,255,0.2)';
                    sCtx.lineWidth = 1;
                    sCtx.beginPath();
                    sCtx.moveTo(20, 5);
                    sCtx.lineTo(20, 35);
                    sCtx.stroke();
                } else if (spice.shape === 'circle') {
                    // Black pepper
                    sCtx.beginPath();
                    sCtx.arc(20, 20, 8, 0, Math.PI * 2);
                    sCtx.fill();
                    // Texture
                    sCtx.fillStyle = 'rgba(255,255,255,0.1)';
                    sCtx.beginPath();
                    sCtx.arc(18, 18, 3, 0, Math.PI * 2);
                    sCtx.fill();
                } else if (spice.shape === 'flake') {
                    // Chili flake
                    sCtx.beginPath();
                    sCtx.moveTo(15, 15);
                    sCtx.lineTo(25, 12);
                    sCtx.lineTo(28, 22);
                    sCtx.lineTo(18, 28);
                    sCtx.closePath();
                    sCtx.fill();
                } else {
                    // Small grains/masala
                    sCtx.beginPath();
                    sCtx.arc(20, 20, 4, 0, Math.PI * 2);
                    sCtx.fill();
                }

                spiceImages.push(sCanvas);
            });
        }

        createSpiceIcons();
        
        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = document.getElementById('heroSection').offsetHeight;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        class Particle {
            constructor() {
                this.init();
                this.y = (height * 0.8) - (Math.random() * height); // Random start
            }
            
            init() {
                // Splash from the center-bottom where the mortar is
                this.x = (width / 2) + (Math.random() * 60 - 30); 
                this.y = height * 0.75; 
                
                this.img = spiceImages[Math.floor(Math.random() * spiceImages.length)];
                
                // Depth and Size
                this.z = Math.random() * 2; 
                this.size = (Math.random() * 15 + 10) * (this.z + 0.5);
                
                // Explosion Motion
                this.speedX = (Math.random() - 0.5) * 12 * (this.z + 0.5);
                this.speedY = (Math.random() * -12 - 8) * (this.z + 0.5);
                this.gravity = 0.25 * (this.z + 0.5);
                
                this.opacity = 1;
                this.angle = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.15;
            }
            
            update() {
                this.speedY += this.gravity;
                this.x += this.speedX;
                this.y += this.speedY;
                this.angle += this.rotationSpeed;
                
                if (this.y < height * 0.1 || this.speedY > 0) {
                    this.opacity -= 0.008;
                }
                
                if (this.y > height + 50 || this.opacity <= 0) {
                    this.init();
                }
            }
            
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.globalAlpha = Math.max(0, this.opacity);
                
                // Depth of field blur for luxury feel
                const blur = Math.abs(this.z - 1) * 3;
                if (blur > 1) {
                    ctx.filter = `blur(${blur}px)`;
                }
                
                ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
                ctx.restore();
            }
        }
        
        function initParticles() {
            const count = window.innerWidth > 768 ? 60 : 30;
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        
        initParticles();

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    // No parallax effect requested
});
