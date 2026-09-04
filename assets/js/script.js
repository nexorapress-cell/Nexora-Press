/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

function closeMobileMenu() {
  if (!menuBtn || !navLinks) {
    return;
  }

  navLinks.classList.remove('active');
  menuBtn.classList.remove('active');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open menu');
}

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', event => {
    event.stopPropagation();

    const isOpen = navLinks.classList.toggle('active');

    menuBtn.classList.toggle('active', isOpen);
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  document.addEventListener('click', event => {
    if (!navLinks.contains(event.target) && !menuBtn.contains(event.target)) {
      closeMobileMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 991) {
      closeMobileMenu();
    }
  });
}


/* =========================================================
   HERO SLIDER
========================================================= */

const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('.hero-dot')];
const prevBtn = document.querySelector('.hero-prev');
const nextBtn = document.querySelector('.hero-next');

let current = 0;
let autoSlide = null;

const AUTO_SLIDE_TIME = 6000;

function showSlide(index) {
  if (!slides.length) {
    return;
  }

  current = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === current);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === current);
  });
}


/* =========================================================
   HERO DOTS
========================================================= */

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showSlide(index);
    restartAutoSlide();
  });
});


/* =========================================================
   HERO PREVIOUS
========================================================= */

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    showSlide(current - 1);
    restartAutoSlide();
  });
}


/* =========================================================
   HERO NEXT
========================================================= */

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    showSlide(current + 1);
    restartAutoSlide();
  });
}


/* =========================================================
   HERO AUTO SLIDE
========================================================= */

function startAutoSlide() {
  if (slides.length <= 1) {
    return;
  }

  clearInterval(autoSlide);

  autoSlide = setInterval(() => {
    showSlide(current + 1);
  }, AUTO_SLIDE_TIME);
}

function stopAutoSlide() {
  clearInterval(autoSlide);
}

function restartAutoSlide() {
  stopAutoSlide();
  startAutoSlide();
}

if (slides.length) {
  showSlide(0);
  startAutoSlide();
}


/* =========================================================
   BOOKS SLIDER
========================================================= */

const booksSlider = document.querySelector('.books-slider');
const booksTrack = document.querySelector('.books-track');

const bookCards = [
  ...document.querySelectorAll('.books-track .book-card')
];

const bookPrev = document.querySelector('.book-slider-prev');
const bookNext = document.querySelector('.book-slider-next');

let bookPosition = 0;
let bookAutoSlide = null;

const BOOK_AUTO_SLIDE_TIME = 3500;


/* =========================================================
   BOOKS PER VIEW
========================================================= */

function getBooksPerView() {
  if (window.innerWidth >= 1100) {
    return 4;
  }

  if (window.innerWidth >= 768) {
    return 3;
  }

  if (window.innerWidth >= 520) {
    return 2;
  }

  return 1;
}


/* =========================================================
   UPDATE BOOK SLIDER
========================================================= */

function updateBooksSlider() {
  if (!booksTrack || !bookCards.length) {
    return;
  }

  const perView = getBooksPerView();
  const maxPosition = Math.max(0, bookCards.length - perView);

  bookPosition = Math.max(
    0,
    Math.min(bookPosition, maxPosition)
  );

  const cardWidth = bookCards[0].getBoundingClientRect().width;
  const trackStyle = window.getComputedStyle(booksTrack);
  const gap = parseFloat(trackStyle.gap) || 0;
  const moveAmount = cardWidth + gap;

  booksTrack.style.transform =
    `translate3d(-${bookPosition * moveAmount}px, 0, 0)`;

  if (bookPrev) {
    bookPrev.disabled = bookCards.length <= perView;
  }

  if (bookNext) {
    bookNext.disabled = bookCards.length <= perView;
  }
}


/* =========================================================
   NEXT BOOK
========================================================= */

function nextBookSlide() {
  if (!booksTrack || !bookCards.length) {
    return;
  }

  const perView = getBooksPerView();
  const maxPosition = Math.max(0, bookCards.length - perView);

  if (bookPosition >= maxPosition) {
    bookPosition = 0;
  } else {
    bookPosition++;
  }

  updateBooksSlider();
}


/* =========================================================
   PREVIOUS BOOK
========================================================= */

function previousBookSlide() {
  if (!booksTrack || !bookCards.length) {
    return;
  }

  const perView = getBooksPerView();
  const maxPosition = Math.max(0, bookCards.length - perView);

  if (bookPosition <= 0) {
    bookPosition = maxPosition;
  } else {
    bookPosition--;
  }

  updateBooksSlider();
}


/* =========================================================
   BOOKS PREVIOUS BUTTON
========================================================= */

if (bookPrev) {
  bookPrev.addEventListener('click', () => {
    previousBookSlide();
    restartBookAutoSlide();
  });
}


/* =========================================================
   BOOKS NEXT BUTTON
========================================================= */

if (bookNext) {
  bookNext.addEventListener('click', () => {
    nextBookSlide();
    restartBookAutoSlide();
  });
}


/* =========================================================
   BOOKS AUTO SLIDE
========================================================= */

function startBookAutoSlide() {
  if (!booksTrack || bookCards.length <= getBooksPerView()) {
    return;
  }

  clearInterval(bookAutoSlide);

  bookAutoSlide = setInterval(() => {
    nextBookSlide();
  }, BOOK_AUTO_SLIDE_TIME);
}

function stopBookAutoSlide() {
  clearInterval(bookAutoSlide);
}

function restartBookAutoSlide() {
  stopBookAutoSlide();
  startBookAutoSlide();
}


/* =========================================================
   PAUSE BOOK SLIDER ON HOVER
========================================================= */

if (booksSlider) {
  booksSlider.addEventListener('mouseenter', () => {
    stopBookAutoSlide();
  });

  booksSlider.addEventListener('mouseleave', () => {
    startBookAutoSlide();
  });
}


/* =========================================================
   BOOK SLIDER RESIZE
========================================================= */

let resizeTimer;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    updateBooksSlider();
    restartBookAutoSlide();
  }, 120);
});


/* =========================================================
   INITIALIZE BOOK SLIDER
========================================================= */

if (booksTrack && bookCards.length) {
  requestAnimationFrame(() => {
    updateBooksSlider();
    startBookAutoSlide();
  });
}


/* =========================================================
   REVEAL ANIMATION
========================================================= */

const revealElements = [
  ...document.querySelectorAll('.reveal')
];

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(element => {
    element.classList.add('show');
  });
}


/* =========================================================
   BOOK CATALOG
   Filter + Search + Sort + Load More
========================================================= */

const catalogGrid = document.querySelector('.catalog-grid');

const filters = [
  ...document.querySelectorAll('.catalog-filters .filter')
];

const cards = [
  ...document.querySelectorAll('.catalog-grid .catalog-card')
];

const searchInput = document.querySelector('#bookSearch');
const sortSelect = document.querySelector('#bookSort');
const catalogCount = document.querySelector('#catalogCount');
const catalogReset = document.querySelector('#catalogReset');
const catalogEmpty = document.querySelector('#catalogEmpty');
const loadMoreButton = document.querySelector('#loadMoreBooks');

let activeFilter = 'all';
let catalogSearch = '';
let catalogSort = 'default';
let catalogVisibleLimit = 20;

const CATALOG_LOAD_AMOUNT = 20;


/* =========================================================
   BOOK DATA
========================================================= */

const catalogBooks = cards.map((card, index) => {
  const titleElement = card.querySelector('.book-info h3');
  const detailsElement = card.querySelector('.book-info p');

  const title = titleElement
    ? titleElement.textContent.trim()
    : '';

  const details = detailsElement
    ? detailsElement.textContent.trim()
    : '';

  const detailsParts = details
    .split('·')
    .map(item => item.trim());

  return {
    element: card,
    index,
    title,
    author: detailsParts[0] || '',
    category: card.dataset.category || '',
    searchText: `${title} ${details}`.toLowerCase()
  };
});


/* =========================================================
   SORT BOOKS
========================================================= */

function sortCatalogBooks(bookList) {
  const sortedBooks = [...bookList];

  switch (catalogSort) {
    case 'default':
      sortedBooks.sort((a, b) => {
        return a.index - b.index;
      });
      break;

    case 'newest':
      sortedBooks.sort((a, b) => {
        return b.index - a.index;
      });
      break;

    case 'title-asc':
      sortedBooks.sort((a, b) => {
        return a.title.localeCompare(
          b.title,
          undefined,
          {
            sensitivity: 'base'
          }
        );
      });
      break;

    case 'title-desc':
      sortedBooks.sort((a, b) => {
        return b.title.localeCompare(
          a.title,
          undefined,
          {
            sensitivity: 'base'
          }
        );
      });
      break;

    case 'author-asc':
      sortedBooks.sort((a, b) => {
        return a.author.localeCompare(
          b.author,
          undefined,
          {
            sensitivity: 'base'
          }
        );
      });
      break;

    case 'author-desc':
      sortedBooks.sort((a, b) => {
        return b.author.localeCompare(
          a.author,
          undefined,
          {
            sensitivity: 'base'
          }
        );
      });
      break;

    default:
      sortedBooks.sort((a, b) => {
        return a.index - b.index;
      });
  }

  return sortedBooks;
}


/* =========================================================
   UPDATE CATALOG
========================================================= */

function updateCatalog() {
  if (!catalogGrid) {
    return;
  }

  const filteredBooks = catalogBooks.filter(book => {
    const categoryMatches =
      activeFilter === 'all' ||
      book.category === activeFilter;

    const searchMatches =
      !catalogSearch ||
      book.searchText.includes(catalogSearch);

    return categoryMatches && searchMatches;
  });

  const sortedBooks = sortCatalogBooks(filteredBooks);

  const visibleBooks = sortedBooks.slice(
    0,
    catalogVisibleLimit
  );

  catalogBooks.forEach(book => {
    book.element.classList.add('hidden');
  });

  sortedBooks.forEach(book => {
    catalogGrid.appendChild(book.element);
  });

  visibleBooks.forEach(book => {
    book.element.classList.remove('hidden');
  });

  if (catalogCount) {
    catalogCount.textContent = sortedBooks.length;
  }

  if (catalogEmpty) {
    catalogEmpty.classList.toggle(
      'hidden',
      sortedBooks.length !== 0
    );
  }

  if (loadMoreButton) {
    const hasMoreBooks =
      sortedBooks.length > catalogVisibleLimit;

    loadMoreButton.classList.toggle(
      'hidden',
      !hasMoreBooks
    );
  }
}


/* =========================================================
   CATEGORY FILTERS
========================================================= */

filters.forEach(button => {
  button.addEventListener('click', () => {
    filters.forEach(item => {
      item.classList.remove('active');
    });

    button.classList.add('active');

    activeFilter =
      button.dataset.filter || 'all';

    catalogVisibleLimit = CATALOG_LOAD_AMOUNT;

    updateCatalog();
  });
});


/* =========================================================
   BOOK SEARCH
========================================================= */

if (searchInput) {
  searchInput.addEventListener('input', event => {
    catalogSearch = event.target.value
      .toLowerCase()
      .trim();

    catalogVisibleLimit = CATALOG_LOAD_AMOUNT;

    updateCatalog();
  });
}


/* =========================================================
   BOOK SORT
========================================================= */

if (sortSelect) {
  sortSelect.addEventListener('change', event => {
    catalogSort = event.target.value || 'default';

    catalogVisibleLimit = CATALOG_LOAD_AMOUNT;

    updateCatalog();
  });
}


/* =========================================================
   LOAD MORE BOOKS
========================================================= */

if (loadMoreButton) {
  loadMoreButton.addEventListener('click', () => {
    catalogVisibleLimit += CATALOG_LOAD_AMOUNT;

    updateCatalog();
  });
}


/* =========================================================
   RESET CATALOG
========================================================= */

if (catalogReset) {
  catalogReset.addEventListener('click', () => {
    activeFilter = 'all';
    catalogSearch = '';
    catalogSort = 'default';
    catalogVisibleLimit = CATALOG_LOAD_AMOUNT;

    if (searchInput) {
      searchInput.value = '';
    }

    if (sortSelect) {
      sortSelect.value = 'default';
    }

    filters.forEach(button => {
      button.classList.toggle(
        'active',
        (button.dataset.filter || 'all') === 'all'
      );
    });

    updateCatalog();
  });
}


/* =========================================================
   INITIALIZE CATALOG
========================================================= */

if (catalogGrid && cards.length) {
  updateCatalog();
}


/* =========================================================
   KEYBOARD ACCESS FOR HERO
========================================================= */

document.addEventListener('keydown', event => {
  if (!slides.length) {
    return;
  }

  const activeElement = document.activeElement;
  const activeTag = activeElement
    ? activeElement.tagName.toLowerCase()
    : '';

  const isTyping =
    activeTag === 'input' ||
    activeTag === 'textarea' ||
    activeTag === 'select' ||
    activeElement?.isContentEditable;

  if (isTyping) {
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    showSlide(current - 1);
    restartAutoSlide();
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    showSlide(current + 1);
    restartAutoSlide();
  }
});


/* =========================================================
   PAUSE HERO SLIDER WHEN TAB IS HIDDEN
========================================================= */

document.addEventListener('visibilitychange', () => {
  if (!slides.length || slides.length <= 1) {
    return;
  }

  if (document.hidden) {
    stopAutoSlide();
  } else {
    startAutoSlide();
  }
});


/* =========================================================
   PAUSE BOOK SLIDER WHEN TAB IS HIDDEN
========================================================= */

document.addEventListener('visibilitychange', () => {
  if (!booksTrack || bookCards.length <= getBooksPerView()) {
    return;
  }

  if (document.hidden) {
    stopBookAutoSlide();
  } else {
    startBookAutoSlide();
  }
});