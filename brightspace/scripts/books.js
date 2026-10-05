/* ============================================================
   BRIGHTSPACE OPTIONAL MODULE — books.js
   Renders reusable book/resource cards from window.BOOKS_CONFIG.
   ============================================================ */
(function () {
  'use strict';

  var config = window.BOOKS_CONFIG || {};

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function statusClass(status) {
    var key = String(status || 'reference').toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return 'book-status book-status-' + key;
  }

  function statusLabel(status) {
    var labels = config.statusLabels || {};
    if (labels[status]) return labels[status];

    return String(status || 'reference')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function buildMeta(book) {
    var items = [];

    if (book.edition) items.push('<span>' + esc(book.edition) + '</span>');
    if (book.year) items.push('<span>' + esc(book.year) + '</span>');
    if (book.publisher) items.push('<span>' + esc(book.publisher) + '</span>');
    if (book.isbn) items.push('<span>ISBN ' + esc(book.isbn) + '</span>');
    if (book.price) items.push('<span>' + esc(book.price) + '</span>');
    if (book.access) items.push('<span>' + esc(book.access) + '</span>');

    if (!items.length) return '';
    return '<div class="book-card-meta">' + items.join('') + '</div>';
  }

  function buildBook(book) {
    var html = '';

    html += '<article class="book-card">';
    html +=   '<div class="book-card-icon" aria-hidden="true">';
    html +=     '<i class="ti ' + esc(book.icon || 'ti-book-2') + '"></i>';
    html +=   '</div>';
    html +=   '<div class="book-card-body">';
    html +=     '<div class="book-card-topline">';
    html +=       '<h4 class="book-card-title">' + esc(book.title || 'Untitled resource') + '</h4>';
    html +=       '<span class="' + statusClass(book.status) + '">' + esc(statusLabel(book.status)) + '</span>';
    html +=     '</div>';

    if (book.authors) {
      html += '<p class="book-card-authors">' + esc(book.authors) + '</p>';
    }

    html += buildMeta(book);

    if (book.note) {
      html += '<p class="book-card-note">' + esc(book.note) + '</p>';
    }

    if (book.url) {
      html += '<a class="book-card-link" href="' + esc(book.url) + '" target="_blank" rel="noopener noreferrer">';
      html +=   '<i class="ti ti-external-link" aria-hidden="true"></i>';
      html +=   esc(book.linkLabel || 'Open resource');
      html += '</a>';
    }

    html +=   '</div>';
    html += '</article>';

    return html;
  }

  function buildGroup(group) {
    var books = Array.isArray(group.books) ? group.books : [];
    if (!books.length) return '';

    var html = '<section class="books-group">';

    if (group.title) {
      html += '<h3 class="books-group-title">' + esc(group.title) + '</h3>';
    }

    if (group.description) {
      html += '<p class="books-module-intro">' + esc(group.description) + '</p>';
    }

    html += '<div class="books-grid">';
    books.forEach(function (book) {
      html += buildBook(book || {});
    });
    html += '</div></section>';

    return html;
  }

  function render(target) {
    var groups = Array.isArray(config.groups) ? config.groups : [];
    var books = Array.isArray(config.books) ? config.books : [];
    var html = '';

    if (config.intro) {
      html += '<p class="books-module-intro">' + esc(config.intro) + '</p>';
    }

    if (groups.length) {
      groups.forEach(function (group) {
        html += buildGroup(group || {});
      });
    } else if (books.length) {
      html += '<div class="books-grid">';
      books.forEach(function (book) {
        html += buildBook(book || {});
      });
      html += '</div>';
    }

    target.classList.add('books-module');
    target.innerHTML = html;
  }

  document.querySelectorAll('[data-books]').forEach(render);
})();
