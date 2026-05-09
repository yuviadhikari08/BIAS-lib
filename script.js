/* 
  EduVault – College Question Paper Digital Library
  Main JavaScript
*/

document.addEventListener('DOMContentLoaded', () => {
  // --- DATA ---
  const papersData = [
    { id: 1, subject: 'Computer Science', title: 'Data Structures and Algorithms', semester: '3rd Sem', year: '2023', type: 'End Term', file: 'cs_dsa_2023.pdf' },
    { id: 2, subject: 'Computer Science', title: 'Operating Systems', semester: '4th Sem', year: '2022', type: 'End Term', file: 'cs_os_2022.pdf' },
    { id: 3, subject: 'Electronics', title: 'Digital Electronics', semester: '3rd Sem', year: '2023', type: 'Mid Term', file: 'ec_de_2023.pdf' },
    { id: 4, subject: 'Mathematics', title: 'Discrete Mathematics', semester: '2nd Sem', year: '2021', type: 'End Term', file: 'ma_dm_2021.pdf' },
    { id: 5, subject: 'Computer Science', title: 'Database Management Systems', semester: '4th Sem', year: '2023', type: 'End Term', file: 'cs_dbms_2023.pdf' },
    { id: 6, subject: 'Mechanical', title: 'Thermodynamics', semester: '3rd Sem', year: '2022', type: 'End Term', file: 'me_td_2022.pdf' },
    { id: 7, subject: 'Computer Science', title: 'Computer Networks', semester: '5th Sem', year: '2022', type: 'End Term', file: 'cs_cn_2022.pdf' },
    { id: 8, subject: 'Electronics', title: 'Microprocessors', semester: '5th Sem', year: '2021', type: 'End Term', file: 'ec_mp_2021.pdf' },
    { id: 9, subject: 'Mathematics', title: 'Engineering Mathematics-I', semester: '1st Sem', year: '2023', type: 'End Term', file: 'ma_m1_2023.pdf' },
    { id: 10, subject: 'Computer Science', title: 'Object Oriented Programming', semester: '3rd Sem', year: '2022', type: 'End Term', file: 'cs_oops_2022.pdf' },
    { id: 11, subject: 'Information Technology', title: 'Web Technologies', semester: '4th Sem', year: '2023', type: 'End Term', file: 'it_wt_2023.pdf' },
    { id: 12, subject: 'Civil', title: 'Structural Analysis', semester: '5th Sem', year: '2022', type: 'End Term', file: 'ce_sa_2022.pdf' }
  ];

  // --- DOM ELEMENTS ---
  const navbar = document.getElementById('navbar');
  const navLinksContainer = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const subjectFilter = document.getElementById('subjectFilter');
  const semesterFilter = document.getElementById('semesterFilter');
  const yearFilter = document.getElementById('yearFilter');
  const resetFilters = document.getElementById('resetFilters');
  const resultsCount = document.getElementById('resultsCount');
  const gridViewBtn = document.getElementById('gridViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');
  const papersGrid = document.getElementById('papersGrid');
  const noResults = document.getElementById('noResults');
  const clearAllFilters = document.getElementById('clearAllFilters');
  const backToTop = document.getElementById('backToTop');
  const paperModal = document.getElementById('paperModal');
  const modalClose = document.getElementById('modalClose');
  const previewModal = document.getElementById('previewModal');
  const previewModalClose = document.getElementById('previewModalClose');
  const queryForm = document.getElementById('queryForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitAnother = document.getElementById('submitAnother');

  // --- INITIALIZATION ---
  lucide.createIcons();
  populateFilters();
  renderPapers(papersData);
  setupRevealAnimations();

  // --- FUNCTIONS ---

  function populateFilters() {
    const subjects = [...new Set(papersData.map(p => p.subject))].sort();
    const semesters = [...new Set(papersData.map(p => p.semester))].sort();
    const years = [...new Set(papersData.map(p => p.year))].sort((a, b) => b - a);

    subjects.forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub;
      opt.textContent = sub;
      subjectFilter.appendChild(opt);
    });

    semesters.forEach(sem => {
      const opt = document.createElement('option');
      opt.value = sem;
      opt.textContent = sem;
      semesterFilter.appendChild(opt);
    });

    years.forEach(yr => {
      const opt = document.createElement('option');
      opt.value = yr;
      opt.textContent = yr;
      yearFilter.appendChild(opt);
    });
  }

  function renderPapers(papers) {
    papersGrid.innerHTML = '';
    
    if (papers.length === 0) {
      noResults.classList.remove('hidden');
      resultsCount.textContent = 'No papers found';
      return;
    }

    noResults.classList.add('hidden');
    resultsCount.textContent = `Showing ${papers.length} paper${papers.length === 1 ? '' : 's'}`;

    papers.forEach(paper => {
      const card = document.createElement('div');
      card.className = 'paper-card animate-on-load';
      
      card.innerHTML = `
        <div class="paper-card-header">
          <div class="paper-icon"><i data-lucide="file-text"></i></div>
          <span class="paper-year">${paper.year}</span>
        </div>
        <div class="paper-subject">${paper.subject}</div>
        <h3 class="paper-title">${paper.title}</h3>
        <div class="paper-meta">
          <span><i data-lucide="calendar"></i> ${paper.semester}</span>
          <span><i data-lucide="layers"></i> ${paper.type}</span>
        </div>
        <div class="paper-actions">
          <button class="btn-view" onclick="window.openPaperModal(${paper.id})">
            <i data-lucide="eye"></i> View Details
          </button>
          <button class="btn-download-sm" onclick="window.downloadPaper('${paper.file}')">
            <i data-lucide="download"></i>
          </button>
        </div>
      `;
      
      papersGrid.appendChild(card);
    });

    // Re-initialize icons for new elements
    lucide.createIcons();
  }

  function filterPapers() {
    const searchTerm = searchInput.value.toLowerCase();
    const subject = subjectFilter.value;
    const semester = semesterFilter.value;
    const year = yearFilter.value;

    const filtered = papersData.filter(paper => {
      const matchesSearch = paper.title.toLowerCase().includes(searchTerm) || 
                          paper.subject.toLowerCase().includes(searchTerm) ||
                          paper.semester.toLowerCase().includes(searchTerm) ||
                          paper.year.includes(searchTerm);
      const matchesSubject = !subject || paper.subject === subject;
      const matchesSemester = !semester || paper.semester === semester;
      const matchesYear = !year || paper.year === year;

      return matchesSearch && matchesSubject && matchesSemester && matchesYear;
    });

    renderPapers(filtered);
    
    // Show/hide clear button
    clearSearch.style.display = searchTerm ? 'block' : 'none';
  }

  function setupRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // --- EVENT LISTENERS ---

  // Navbar Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      backToTop.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      backToTop.classList.remove('visible');
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu
  hamburger.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Change hamburger icon
    const spans = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close mobile menu when link clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('active');
      hamburger.classList.remove('active');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // Filtering
  searchInput.addEventListener('input', filterPapers);
  subjectFilter.addEventListener('change', filterPapers);
  semesterFilter.addEventListener('change', filterPapers);
  yearFilter.addEventListener('change', filterPapers);

  clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    filterPapers();
  });

  resetFilters.addEventListener('click', () => {
    searchInput.value = '';
    subjectFilter.value = '';
    semesterFilter.value = '';
    yearFilter.value = '';
    filterPapers();
  });

  clearAllFilters.addEventListener('click', () => {
    resetFilters.click();
  });

  // View Toggle
  gridViewBtn.addEventListener('click', () => {
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    papersGrid.classList.remove('list-view');
  });

  listViewBtn.addEventListener('click', () => {
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    papersGrid.classList.add('list-view');
  });

  // Modal Handling
  window.openPaperModal = (id) => {
    const paper = papersData.find(p => p.id === id);
    if (!paper) return;

    document.getElementById('modalSubjectTag').textContent = paper.subject;
    document.getElementById('modalTitle').textContent = paper.title;
    document.getElementById('modalPreviewTitle').textContent = paper.title;
    document.getElementById('modalMeta').innerHTML = `
      <span><i data-lucide="calendar"></i> ${paper.semester}</span>
      <span><i data-lucide="clock"></i> Year ${paper.year}</span>
      <span><i data-lucide="layers"></i> ${paper.type}</span>
    `;
    
    // Set up preview button
    document.getElementById('modalPreviewBtn').onclick = () => {
      paperModal.classList.remove('active');
      window.openPreviewModal(paper);
    };

    // Set up download button
    document.getElementById('modalDownloadBtn').onclick = () => {
      window.downloadPaper(paper.file);
    };

    paperModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
  };

  modalClose.addEventListener('click', () => {
    paperModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  window.openPreviewModal = (paper) => {
    document.getElementById('previewModalTitle').textContent = `Preview: ${paper.title}`;
    document.getElementById('previewFilePath').textContent = paper.file;
    
    document.getElementById('previewDownloadInstead').onclick = () => {
      window.downloadPaper(paper.file);
    };

    previewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  previewModalClose.addEventListener('click', () => {
    previewModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  // Close modals on outside click
  [paperModal, previewModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });

  // Download logic (simulation)
  window.downloadPaper = (filename) => {
    const btn = event.currentTarget;
    const originalContent = btn.innerHTML;
    
    btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i>';
    lucide.createIcons();
    btn.disabled = true;

    // Simulate download delay
    setTimeout(() => {
      alert(`Downloading ${filename}...\n(This is a demo simulation)`);
      btn.innerHTML = originalContent;
      lucide.createIcons();
      btn.disabled = false;
    }, 1000);
  };

  // Form Submission
  queryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('studentName').value.trim();
    const email = document.getElementById('studentEmail').value.trim();
    const message = document.getElementById('queryMessage').value.trim();
    
    let isValid = true;

    // Reset errors
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');

    if (!name) {
      document.getElementById('nameError').textContent = 'Please enter your name';
      isValid = false;
    }
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById('emailError').textContent = 'Please enter a valid email address';
      isValid = false;
    }
    
    if (!message) {
      document.getElementById('messageError').textContent = 'Please enter your query';
      isValid = false;
    }

    if (isValid) {
      const submitBtn = document.getElementById('submitBtn');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i><span>Submitting...</span>';
      lucide.createIcons();
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        queryForm.classList.add('hidden');
        formSuccess.classList.remove('hidden');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        lucide.createIcons();
      }, 1500);
    }
  });

  submitAnother.addEventListener('click', () => {
    formSuccess.classList.add('hidden');
    queryForm.classList.remove('hidden');
    queryForm.reset();
  });

  // Back to top
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
