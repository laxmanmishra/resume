// Digital CV Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav links and sections
            navLinks.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Smooth scrolling for better UX
    function smoothScrollTo(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Add typing animation to the name
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

    // Initialize typing animation for the name
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const originalText = nameElement.textContent;
        setTimeout(() => {
            typeWriter(nameElement, originalText, 150);
        }, 500);
    }

    // Add hover effects to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Add click-to-copy functionality for contact information
    const contactItems = document.querySelectorAll('.contact-item span');
    contactItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.title = 'Click to copy';
        
        item.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                // Show temporary feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.style.color = '#27ae60';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = '';
                }, 1500);
            }).catch(err => {
                console.log('Could not copy text: ', err);
            });
        });
    });

    // Add progress animation to timeline items
    function animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.1 });

        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
            observer.observe(item);
        });
    }

    // Add floating animation to highlight items
    function animateHighlights() {
        const highlightItems = document.querySelectorAll('.highlight-item');
        highlightItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('float-in');
        });
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-in {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .float-in {
            animation: float-in 0.6s ease forwards;
        }
        
        .skill-tag {
            transition: transform 0.3s ease;
        }
        
        .contact-item span:hover {
            color: #3498db !important;
        }
    `;
    document.head.appendChild(style);

    // Initialize animations when sections become visible
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                if (sectionId === 'summary') {
                    setTimeout(animateHighlights, 200);
                } else if (sectionId === 'experience') {
                    setTimeout(animateTimeline, 200);
                }
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        const activeNavIndex = Array.from(navLinks).findIndex(link => link.classList.contains('active'));
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (activeNavIndex + 1) % navLinks.length;
            navLinks[nextIndex].click();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (activeNavIndex - 1 + navLinks.length) % navLinks.length;
            navLinks[prevIndex].click();
        }
    });

    // Add print functionality
    function addPrintButton() {
        const printButton = document.createElement('button');
        printButton.innerHTML = '<i class="fas fa-print"></i> Print CV';
        printButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #3498db;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        printButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(52, 152, 219, 0.4)';
        });
        
        printButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(52, 152, 219, 0.3)';
        });
        
        printButton.addEventListener('click', function() {
            // Show all sections for printing
            sections.forEach(section => section.style.display = 'block');
            window.print();
            // Restore section visibility after printing
            setTimeout(() => {
                sections.forEach(section => {
                    if (!section.classList.contains('active')) {
                        section.style.display = 'none';
                    }
                });
            }, 1000);
        });
        
        document.body.appendChild(printButton);
    }

    // Add download CV functionality
    function addDownloadButton() {
        // Create download container
        const downloadContainer = document.createElement('div');
        downloadContainer.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 1000;
        `;

        // Create main download button
        const downloadButton = document.createElement('button');
        downloadButton.innerHTML = '<i class="fas fa-download"></i> Download CV <i class="fas fa-chevron-down"></i>';
        downloadButton.style.cssText = `
            background: #e74c3c;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
            transition: all 0.3s ease;
            width: 150px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;

        // Create dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.style.cssText = `
            position: absolute;
            bottom: 100%;
            right: 0;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            padding: 8px 0;
            margin-bottom: 10px;
            min-width: 180px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.3s ease;
        `;

        // Create PDF download option
        const pdfOption = document.createElement('a');
        pdfOption.href = 'Laxman_Mishra_Updated_CV.pdf';
        pdfOption.download = 'Laxman_Mishra_CV.pdf';
        pdfOption.innerHTML = '<i class="fas fa-file-pdf"></i> Download PDF';
        pdfOption.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            color: #e74c3c;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s ease;
        `;

        // Create DOC download option
        const docOption = document.createElement('a');
        docOption.href = 'Laxman_Mishra_Updated_CV.docx';
        docOption.download = 'Laxman_Mishra_CV.docx';
        docOption.innerHTML = '<i class="fas fa-file-word"></i> Download DOC';
        docOption.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            color: #2980b9;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s ease;
        `;

        // Add hover effects
        pdfOption.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        pdfOption.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });

        docOption.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        docOption.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });

        // Append options to dropdown
        dropdownMenu.appendChild(pdfOption);
        dropdownMenu.appendChild(docOption);

        // Append elements to container
        downloadContainer.appendChild(dropdownMenu);
        downloadContainer.appendChild(downloadButton);
        
        // Button hover effects
        downloadButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(231, 76, 60, 0.4)';
        });
        
        downloadButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(231, 76, 60, 0.3)';
        });

        // Toggle dropdown on button click
        downloadButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = dropdownMenu.style.opacity === '1';
            
            if (isVisible) {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
                dropdownMenu.style.transform = 'translateY(10px)';
            } else {
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.visibility = 'visible';
                dropdownMenu.style.transform = 'translateY(0)';
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            dropdownMenu.style.opacity = '0';
            dropdownMenu.style.visibility = 'hidden';
            dropdownMenu.style.transform = 'translateY(10px)';
        });

        // Prevent dropdown from closing when clicking inside it
        dropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        document.body.appendChild(downloadContainer);
    }

    // Initialize additional features
    addPrintButton();
    addDownloadButton();

    // Add loading animation
    function showLoadingComplete() {
        const loader = document.createElement('div');
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        `;
        
        loader.innerHTML = `
            <div style="text-align: center; color: white;">
                <div style="width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <p style="font-size: 18px; font-weight: 500;">Loading Digital CV...</p>
            </div>
        `;
        
        const spinStyle = document.createElement('style');
        spinStyle.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinStyle);
        
        document.body.appendChild(loader);
        
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(loader);
            }, 500);
        }, 1500);
    }

    // Show loading animation on page load
    showLoadingComplete();

    // Add scroll-to-top functionality
    function addScrollToTop() {
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 140px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
        `;
        
        scrollButton.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollButton.style.opacity = '1';
                scrollButton.style.visibility = 'visible';
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.visibility = 'hidden';
            }
        });
        
        document.body.appendChild(scrollButton);
    }

    addScrollToTop();

    console.log('Digital CV loaded successfully! 🚀');
});
