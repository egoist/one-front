var $ = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);
var api = function(path) {
  return 'http://dev.one.avosapps.com/api/' + path;
};

function render(tpl, data) {
  var html = $(tpl + '-template').innerHTML;
  return nunjucks.renderString(html, data);
};

function loading() {
  var html = render('loading');
  $('output').innerHTML = html;
};

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

function removeActive() {
  Array.prototype.forEach.call($$('.tab'), function(el, i){
    el.classList.remove('active');
  });
};

function lazyload() {
  echo.init({
    callback: function(element, op) {
      if(op === 'load') {
        element.classList.add('loaded');
      } else {
        element.classList.remove('loaded');
      }
    }
  });
  echo.render()
};

ready(function() {
  lazyload();
  removeActive();
  $(Q.lash + '-button').classList.add('active');
});

function HomeRouter() {
  var url = api('latest');
  loading();
  qwest.get(url)
    .then(function(data) {
      var html = render('list', {ones: data});
      $('output').innerHTML = html;
      lazyload();
    })
};

function ThingsRouter() {
  var url = api('things');
  loading();
  qwest.get(url)
    .then(function(data) {
      var html = render('things', {ones: data});
      $('output').innerHTML = html;
      lazyload();
    })
};

function QuestionsRouter() {
  var url = api('questions');
  loading();
  qwest.get(url)
    .then(function(data) {
      var html = render('questions', {ones: data});
      $('output').innerHTML = html;
    })
};

Q.reg('home', HomeRouter);
Q.reg('things', ThingsRouter);
Q.reg('questions', QuestionsRouter);

Q.init({
  index: 'home'
});
