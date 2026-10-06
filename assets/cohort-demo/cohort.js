/* Data-flow stepper and pace check for the cohort project page.
   The pace check mirrors pace/progress.py in github.com/Bharath-Naveen/cohort-analytics
   and is checked against that repo's tests/vectors.json. */
(function (root) {
  'use strict';

  var TERMS_PER_YEAR = { semester: 2, quarter: 3 };

  function classify(countedCredits, termsCompleted, degreeCredits, milestoneYears, tolerance, system) {
    var perTerm = degreeCredits / (milestoneYears * TERMS_PER_YEAR[system]);
    var expected = perTerm * termsCompleted;
    var half = expected * tolerance / 2;
    var lower = expected - half, upper = expected + half;
    var status = countedCredits >= lower && countedCredits <= upper ? 'On Track'
      : countedCredits < lower ? 'Behind' : 'Ahead';
    return { status: status, progressPct: countedCredits / degreeCredits * 100,
      expected: expected, lower: lower, upper: upper };
  }

  if (typeof module !== 'undefined' && module.exports) { module.exports = { classify: classify }; return; }

  var MINE = 'My work', TEAM = 'Legacy system, built by the university team', PLAN = 'Planned, not connected yet';
  var LEGACY = [
    { lab: 'Source', own: 'University system', svc: 'Student information database',
      h: 'It starts with the university’s own records',
      p: 'Student records, degree requirements, and the course catalog live in the university’s institutional database. Nothing in the platform changes that data. It only reads from it.' },
    { lab: 'Extract', own: TEAM, svc: 'AWS Glue → S3',
      h: 'Glue jobs pull the data into S3',
      p: 'Glue jobs, started on demand, load student data, degree requirements, and course data into S3, where the rest of the pipeline picks it up.',
      side: '<b>Privacy step.</b> For the development environment, a job replaces real student records with generated fake ones, so developers never work on real students.' },
    { lab: 'Container', own: TEAM, svc: 'Docker → ECR → ECS / Fargate',
      h: 'The ETL runs as a container on Fargate',
      p: 'The ETL is a Julia application packaged as a Docker image and stored in ECR. Each load runs as an ECS task on Fargate, so there are no servers to manage. One job loads a whole college, another loads a single program.' },
    { lab: 'Match', own: TEAM, svc: 'Julia + Gurobi solver',
      h: 'Each course is matched to a degree requirement',
      p: 'Credit hours alone do not show progress, because a course only helps if it satisfies a requirement. The Gurobi optimization solver assigns the courses on each transcript to the requirements of the student’s program.',
      side: '<b>Courses that do not count</b> are kept with a reason, such as a retake, a withdrawal, or a grade that is too low.' },
    { lab: 'Pace check', own: TEAM, svc: 'Degree-progress classification',
      h: 'Counted credits become On Track, Behind, or Ahead',
      p: 'The credits that count are compared with the credits expected after that many terms, inside a tolerance band. Every student gets a status and a percent of the degree completed.',
      side: '<b>Try it.</b> The <a href="#pace">pace check below</a> runs my own copy of this rule on a made-up student.' },
    { lab: 'Store', own: TEAM, svc: 'DynamoDB + S3',
      h: 'Results land in DynamoDB',
      p: 'Processed student results are written to DynamoDB, which has secondary indexes built around the questions the dashboard asks, such as all students in one college and program.',
      side: '<b>Failures do not stop the job.</b> Students that could not be processed are written to a file in S3 for someone to inspect.' },
    { lab: 'API', own: TEAM, svc: 'API Gateway + Lambda',
      h: 'A Lambda API answers cohort questions',
      p: 'API Gateway passes each request to a Lambda function that queries DynamoDB and returns summaries, such as GPA and credit totals, progress groups, and grade counts per course. Repeat requests are served from a cache.' },
    { lab: 'Dashboard', own: TEAM, svc: 'Vue.js on S3',
      h: 'Advisors explore the cohort',
      p: 'A Vue.js dashboard hosted on S3 lets authorized staff pick a year, college, department, and program, apply filters, and drill down from a cohort summary to a single student’s degree audit.' }
  ];

  var PROTO = [
    { lab: 'Request', own: PLAN, svc: 'Lambda function URL',
      h: 'A request to save or change a degree plan comes in',
      p: 'The prototype is called through the Lambda function\u2019s own URL. Reads and writes go in and come back as JSON. That let me test the backend by itself, sending requests and reading the responses while I iterated on the code.',
      side: '<b>Not connected yet.</b> The front end was planned to call this backend, but that link was not built during the prototype.' },
    { lab: 'Lambda', mine: 1, own: MINE, svc: 'AWS Lambda',
      h: 'A Lambda function handles the plan operation',
      p: 'The function receives the request, carries out the operation on the student\u2019s degree plan, and coordinates the two places the plan is stored. It is serverless, so there is nothing to keep running between requests.' },
    { lab: 'Current plan', mine: 1, own: MINE, svc: 'DynamoDB, new table',
      h: 'The current plan lives in a new DynamoDB table',
      p: 'The latest state of the plan is stored in a table created for the prototype.',
      side: '<b>Kept apart on purpose.</b> The prototype never read from or wrote to the live database.' },
    { lab: 'History', mine: 1, own: MINE, svc: 'S3',
      h: 'Every plan is kept as a version in S3',
      p: 'Instead of overwriting the plan, each change is saved to S3 as a new version. DynamoDB answers \u201cwhat is the plan now\u201d, and S3 answers \u201cwhat was it before\u201d.' },
    { lab: 'Revert', mine: 1, own: MINE, svc: 'S3 \u2192 Lambda \u2192 DynamoDB',
      h: 'Revert goes back to the previously approved plan',
      p: 'Because every plan is stored, a change can be undone. Revert returns the student to the previously approved plan, meaning the last one the school cleared: its electives count toward the minimum credits required and fit the program\u2019s curriculum. The workflow I tested was: start from one version, customize it into a new version, then revert.' }
  ];

  /* Architecture diagram, redrawn for this site. Each shape carries the step it belongs to. */
  function svg(steps, vb, build) {
    var o = [];
    function arrow(x1, y1, x2, y2, step, dash) {
      var h = x1 === x2 ? (y2 > y1 ? [x2 - 5, y2 - 8, x2 + 5, y2 - 8] : [x2 - 5, y2 + 8, x2 + 5, y2 + 8])
        : (x2 > x1 ? [x2 - 8, y2 - 5, x2 - 8, y2 + 5] : [x2 + 8, y2 - 5, x2 + 8, y2 + 5]);
      o.push('<g class="cd-arr' + (dash ? ' dash' : '') + '" data-step="' + step + '"><line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>' +
        '<polygon points="' + x2 + ',' + y2 + ' ' + h[0] + ',' + h[1] + ' ' + h[2] + ',' + h[3] + '"/></g>');
    }
    function node(x, y, w, h, step, name, sub, opt) {
      opt = opt || {}; var first = +String(step).split(',')[0];
      var cls = 'cd-n' + (opt.plan ? ' plan' : steps[first].mine ? ' mine' : '') + (opt.chip ? ' chip' : '') + (opt.group ? ' group' : '');
      var t = '<g class="' + cls + '" data-step="' + step + '" tabindex="0" role="button" aria-label="Step ' + (step + 1) + ': ' + name + '">' +
        '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (opt.chip ? 13 : 11) + '"/>';
      if (opt.group) t += '<text class="gt" x="' + (x + 16) + '" y="' + (y + 21) + '">' + name + '</text>';
      else if (opt.chip) t += '<text class="s' + (opt.id ? '" id="' + opt.id : '') + '" x="' + (x + w / 2) + '" y="' + (y + h / 2 + 4) + '" text-anchor="middle">' + name + '</text>';
      else t += '<text class="t" x="' + (x + w / 2) + '" y="' + (y + h / 2 - 2) + '" text-anchor="middle">' + name + '</text>' +
        '<text class="s" x="' + (x + w / 2) + '" y="' + (y + h / 2 + 15) + '" text-anchor="middle">' + sub + '</text>';
      if (opt.num) t += '<circle class="nb" cx="' + (x + 2) + '" cy="' + (y + 2) + '" r="10"/><text class="nt" x="' + (x + 2) + '" y="' + (y + 6) + '" text-anchor="middle">' + (opt.num === true || opt.num === 1 ? first + 1 : opt.num) + '</text>';
      o.push(t + '</g>');
    }
    build(arrow, node);
    return '<svg class="cd-dia" viewBox="' + vb + '" role="group" aria-label="Architecture diagram">' + o.join('') + '</svg>';
  }
  function legacyDiagram() {
    return svg(LEGACY, '-6 -10 786 308', function (arrow, node) {
      arrow(132, 96, 158, 96, 1); arrow(254, 96, 280, 96, 1); arrow(380, 96, 408, 96, 2);
      arrow(590, 32, 590, 50, 2); arrow(590, 104, 602, 104, 4);
      arrow(570, 142, 570, 196, 5); arrow(718, 142, 718, 196, 5, 1);
      arrow(500, 224, 458, 224, 6); arrow(318, 224, 282, 224, 6); arrow(160, 224, 132, 224, 7);
      arrow(388, 252, 388, 266, 6, 1);
      node(8, 68, 124, 56, 0, 'Student records', 'University database', { num: 1 });
      node(158, 68, 96, 56, 1, 'AWS Glue', 'Extract jobs', { num: 1 });
      node(280, 68, 100, 56, 1, 'S3', 'Staged data');
      node(408, 50, 364, 92, 2, 'ETL container: Julia on ECS / Fargate', '', { group: 1, num: 1 });
      node(500, 4, 180, 28, 2, 'Docker image from ECR', '', { chip: 1 });
      node(422, 80, 168, 50, 3, 'Match courses', 'to degree requirements', { num: 1 });
      node(602, 80, 156, 50, 4, 'Pace check', 'On Track, Behind, Ahead', { num: 1 });
      node(500, 196, 140, 56, 5, 'DynamoDB', 'Indexed results', { num: 1 });
      node(664, 196, 108, 56, 5, 'S3', 'Failed records');
      node(318, 196, 140, 56, 6, 'Lambda API', 'Cohort queries', { num: 1 });
      node(160, 196, 122, 56, 6, 'API Gateway', 'Requests');
      node(338, 266, 100, 26, 6, 'Response cache', '', { chip: 1 });
      node(8, 196, 124, 56, 7, 'Dashboard', 'Vue.js on S3', { num: 1 });
    });
  }
  function protoDiagram() {
    return svg(PROTO, '-6 18 786 196', function (arrow, node) {
      arrow(258, 72, 300, 72, 0); arrow(258, 152, 300, 152, 0, 1);
      arrow(450, 68, 492, 68, 2); arrow(450, 151, 492, 151, 3);
      arrow(569, 128, 569, 96, 4, 1);
      node(128, 44, 130, 56, 0, 'Test request', 'Called directly', { num: 1 });
      node(128, 124, 130, 56, 0, 'Front end', 'Not connected yet', { plan: 1 });
      node(300, 40, 150, 144, 1, 'Lambda function', 'Function URL', { num: 1 });
      node(492, 40, 154, 56, 2, 'DynamoDB', 'Current plan', { num: 1 });
      node(492, 128, 154, 46, '3,4', 'S3', 'Version history', { num: 4 });
      node(504, 184, 40, 22, 3, 'v1', '', { chip: 1 }); node(549, 184, 40, 22, '3,4', 'v2', '', { chip: 1 }); node(594, 184, 40, 22, 3, 'v3', '', { chip: 1 });
    });
  }

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  var live = null;
  function flow(box, STEPS, diagram, legend) {
    var i = 0, timer = null;
    box.innerHTML = '';
    box.appendChild(el('div', 'cd-legend', legend));
    var track = el('div', 'cd-track'); track.setAttribute('role', 'tablist'); track.setAttribute('aria-label', 'Pipeline steps');
    var fill = el('span', 'cd-fill'); track.appendChild(fill);
    var nodes = STEPS.map(function (s, n) {
      var b = el('button', 'cd-node' + (s.mine ? ' mine' : ''), '<span class="cd-dot">' + (n + 1) + '</span><span class="cd-lab">' + s.lab + '</span>');
      b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', 'Step ' + (n + 1) + ': ' + s.lab);
      b.addEventListener('click', function () { stop(); go(n); });
      track.appendChild(b); return b;
    });
    var dia = el('div', 'cd-diawrap', diagram()); box.appendChild(dia);
    var shapes = [].slice.call(dia.querySelectorAll('[data-step]'));
    dia.addEventListener('click', function (e) {
      var g = e.target.closest ? e.target.closest('.cd-n') : null; if (!g) return;
      stop(); go(parseInt(g.getAttribute('data-step'), 10));
    });
    dia.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var g = e.target.closest ? e.target.closest('.cd-n') : null; if (!g) return;
      e.preventDefault(); stop(); go(parseInt(g.getAttribute('data-step'), 10));
    });
    box.appendChild(track);
    var panel = el('div', 'cd-panel'); panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-live', 'polite');
    var body = el('div'); panel.appendChild(body); box.appendChild(panel);
    var ctrl = el('div', 'cd-ctrl');
    var prev = el('button', 'cd-btn', 'Back'), next = el('button', 'cd-btn go', 'Next step'), play = el('button', 'cd-btn', 'Play'), count = el('span', 'cd-count');
    [prev, next, play].forEach(function (b) { b.type = 'button'; ctrl.appendChild(b); }); ctrl.appendChild(count);
    box.appendChild(ctrl);

    function go(n) {
      i = Math.max(0, Math.min(STEPS.length - 1, n));
      var s = STEPS[i];
      shapes.forEach(function (g) {
        var ks = g.getAttribute('data-step').split(',').map(Number);
        g.classList.toggle('on', ks.indexOf(i) > -1); g.classList.toggle('done', ks.indexOf(i) < 0 && ks[0] < i);
      });
      nodes.forEach(function (b, k) {
        b.classList.toggle('on', k === i); b.classList.toggle('done', k < i);
        b.setAttribute('aria-selected', k === i ? 'true' : 'false'); b.tabIndex = k === i ? 0 : -1;
      });
      var a = nodes[0].querySelector('.cd-dot'), z = nodes[i].querySelector('.cd-dot');
      fill.style.width = (z.getBoundingClientRect().left - a.getBoundingClientRect().left) + 'px';
      body.className = ''; void body.offsetWidth; body.className = 'cd-fade';
      body.innerHTML = '<div class="cd-meta"><span class="cd-own' + (s.mine ? ' mine' : '') + '">' + s.own + '</span><span class="cd-svc">' + s.svc + '</span></div>' +
        '<h3>' + s.h + '</h3><p>' + s.p + '</p>' + (s.side ? '<div class="cd-side">' + s.side + '</div>' : '');
      prev.disabled = i === 0;
      next.textContent = i === STEPS.length - 1 ? 'Start over' : 'Next step';
      count.textContent = (i + 1) + ' / ' + STEPS.length;
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; play.textContent = 'Play'; } }
    prev.addEventListener('click', function () { stop(); go(i - 1); });
    next.addEventListener('click', function () { stop(); go(i === STEPS.length - 1 ? 0 : i + 1); });
    play.addEventListener('click', function () {
      if (timer) return stop();
      if (i === STEPS.length - 1) go(0);
      play.textContent = 'Pause';
      timer = setInterval(function () { if (i === STEPS.length - 1) stop(); else go(i + 1); }, 3200);
    });
    track.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault(); stop(); go(i + (e.key === 'ArrowRight' ? 1 : -1)); nodes[i].focus();
    });
    var x0 = null;
    panel.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    panel.addEventListener('touchend', function (e) {
      if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) { stop(); go(i + (dx < 0 ? 1 : -1)); }
    });
    live = { stop: stop, redraw: function () { go(i); } };
    go(0);
  }

  function initFlow(box) {
    var bar = el('div', 'cd-tabs');
    var seg = el('div', 'cd-seg', '<button type="button" data-v="proto">The prototype</button><button type="button" data-v="legacy">The legacy system</button>');
    seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', 'Which system to show');
    var cap = el('span', 'cd-tabcap'); bar.appendChild(seg); bar.appendChild(cap);
    var host = el('div');
    box.innerHTML = ''; box.appendChild(bar); box.appendChild(host);
    function show(v) {
      if (live) live.stop();
      [].forEach.call(seg.children, function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-v') === v ? 'true' : 'false'); });
      if (v === 'proto') {
        cap.textContent = 'What I worked on';
        flow(host, PROTO, protoDiagram, '<span><i class="mine"></i>My work</span><span><i class="plan"></i>Planned, not connected yet</span>');
      } else {
        cap.textContent = 'What the team was asked to restructure';
        flow(host, LEGACY, legacyDiagram, '<span><i></i>Legacy system, built by the university team. None of this is my work.</span>');
      }
    }
    seg.addEventListener('click', function (e) { var v = e.target.getAttribute && e.target.getAttribute('data-v'); if (v) show(v); });
    window.addEventListener('resize', function () { if (live) live.redraw(); });
    show('proto');
  }

  function initPace(box) {
    var st = { credits: 48, terms: 4, tol: 10, system: 'semester' };
    var DEG = { semester: 120, quarter: 180 }, YEARS = 4;
    box.innerHTML =
      '<div class="cd-grid">' +
      '<div class="cd-field"><label for="cd-cr">Credits that count toward the degree <output id="cd-cr-o"></output></label><input type="range" id="cd-cr" min="0" max="200" step="1"></div>' +
      '<div class="cd-field"><label for="cd-tm">Terms completed <output id="cd-tm-o"></output></label><input type="range" id="cd-tm" min="0" max="12" step="1"></div>' +
      '<div class="cd-field"><label for="cd-tl">Tolerance band <output id="cd-tl-o"></output></label><input type="range" id="cd-tl" min="0" max="30" step="1"></div>' +
      '<div class="cd-field"><label>Academic calendar</label><div class="cd-seg" role="group" aria-label="Academic calendar"><button type="button" data-sys="semester">Semesters</button><button type="button" data-sys="quarter">Quarters</button></div></div>' +
      '</div>' +
      '<div class="cd-out" aria-live="polite"><div class="cd-status"><span class="cd-badge"></span><span class="cd-why"></span></div>' +
      '<div class="cd-bar"><div class="cd-band"></div><div class="cd-mark"></div><div class="cd-axis"><span>0</span><span class="cd-max"></span></div></div>' +
      '<div class="cd-math"></div></div>';
    var q = function (s) { return box.querySelector(s); };
    var cr = q('#cd-cr'), tm = q('#cd-tm'), tl = q('#cd-tl');
    function fmt(x) { return (Math.round(x * 10) / 10).toString(); }
    function draw() {
      var deg = DEG[st.system], maxTerms = YEARS * TERMS_PER_YEAR[st.system], scale = deg * 1.25;
      cr.max = Math.round(scale); tm.max = maxTerms;
      st.credits = Math.min(st.credits, +cr.max); st.terms = Math.min(st.terms, maxTerms);
      cr.value = st.credits; tm.value = st.terms; tl.value = st.tol;
      var r = classify(st.credits, st.terms, deg, YEARS, st.tol / 100, st.system);
      q('#cd-cr-o').textContent = st.credits + ' of ' + deg;
      q('#cd-tm-o').textContent = st.terms + ' of ' + maxTerms;
      q('#cd-tl-o').textContent = st.tol + '%';
      [].forEach.call(box.querySelectorAll('.cd-seg button'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-sys') === st.system ? 'true' : 'false'); });
      var badge = q('.cd-badge'); badge.textContent = r.status; badge.setAttribute('data-s', r.status);
      var gap = st.credits - r.expected;
      q('.cd-why').textContent = r.status === 'On Track'
        ? 'Within the band around the ' + fmt(r.expected) + ' credits expected by now. ' + fmt(r.progressPct) + '% of the degree is done.'
        : fmt(Math.abs(gap)) + ' credits ' + (gap < 0 ? 'under' : 'over') + ' the ' + fmt(r.expected) + ' expected by now. ' + fmt(r.progressPct) + '% of the degree is done.';
      var band = q('.cd-band'), mark = q('.cd-mark'), pos = Math.min(100, st.credits / scale * 100);
      band.style.left = (r.lower / scale * 100) + '%';
      band.style.width = Math.max(0, (r.upper - r.lower) / scale * 100) + '%';
      mark.style.left = pos + '%'; mark.setAttribute('data-l', 'This student: ' + st.credits);
      mark.className = 'cd-mark' + (pos < 18 ? ' l' : pos > 82 ? ' r' : '');
      q('.cd-max').textContent = Math.round(scale) + ' credits';
      q('.cd-math').textContent = 'expected = ' + deg + ' / (' + YEARS + ' years × ' + TERMS_PER_YEAR[st.system] + ' terms) × ' + st.terms + ' terms = ' + fmt(r.expected) +
        '   |   On Track from ' + fmt(r.lower) + ' to ' + fmt(r.upper);
    }
    cr.addEventListener('input', function () { st.credits = +cr.value; draw(); });
    tm.addEventListener('input', function () { st.terms = +tm.value; draw(); });
    tl.addEventListener('input', function () { st.tol = +tl.value; draw(); });
    box.querySelector('.cd-seg').addEventListener('click', function (e) {
      var s = e.target.getAttribute && e.target.getAttribute('data-sys'); if (!s || s === st.system) return;
      st.credits = Math.round(st.credits * DEG[s] / DEG[st.system]);
      st.terms = Math.round(st.terms * TERMS_PER_YEAR[s] / TERMS_PER_YEAR[st.system]);
      st.system = s; draw();
    });
    draw();
  }


  /* Plan sandbox: a browser-only stand-in. Courses are matched to requirements (a tiny version of what the
     platform's engine does), and every plan is saved, approved or not, with revert to the last approved one. */
  function initSandbox(box) {
    var MIN = 15, CR = 3;
    var SLOTS = [['core', 'Major core'], ['core', 'Major core'], ['math', 'Math foundation'], ['gen', 'General education'], ['elec', 'Elective']];
    var COURSES = { 'DATA 201': ['core', 'elec'], 'DATA 230': ['core', 'elec'], 'CSCI 210': ['core', 'elec'], 'MATH 220': ['math', 'elec'], 'STAT 310': ['math', 'elec'],
      'WRIT 150': ['gen'], 'HIST 105': ['gen'], 'ECON 200': ['elec'], 'KINE 110': [] };
    var NAMES = Object.keys(COURSES);
    var TITLE = { 'DATA 201': 'Intro to Data Science', 'DATA 230': 'Machine Learning', 'CSCI 210': 'Data Structures', 'MATH 220': 'Linear Algebra', 'STAT 310': 'Probability Theory',
      'WRIT 150': 'Academic Writing', 'HIST 105': 'World History', 'ECON 200': 'Microeconomics', 'KINE 110': 'Bowling' };
    var cur = ['DATA 201', 'DATA 230', 'MATH 220', 'WRIT 150', 'ECON 200'];
    var versions = [{ n: 1, note: 'Starting plan', plan: cur.slice(), ok: true }], at = 1, msg = '';
    var TOUGH = [['MATH 220', 'STAT 310'], ['CSCI 210', 'DATA 230']];
    var EYES = '<circle cx="24" cy="35" r="2.6" class="f2"/><circle cx="40" cy="35" r="2.6" class="f2"/>';
    var MOODS = {
      happy: { eyes: '<path class="f3" d="M20 36c2-4 6-4 8 0M36 36c2-4 6-4 8 0"/>', mouth: 'M22 43c5 8 15 8 20 0z', fill: 1 },
      good: { eyes: EYES, mouth: 'M23 45c5 4 13 4 18 0' },
      tough: { eyes: EYES, brows: 'M19 29l8-2M45 29l-8-2', mouth: 'M23 47c3-3 5 3 9 0s6 3 9 0', extra: '<path class="f4" d="M51 20c3 5 4 7 4 9a4 4 0 0 1-8 0c0-2 1-4 4-9z"/>' },
      sad: { eyes: EYES, brows: 'M19 28l8 3M45 28l-8 3', mouth: 'M23 48c5-5 13-5 18 0' },
      lost: { eyes: '<circle cx="24" cy="35" r="2.6" class="f2"/><circle cx="40" cy="34" r="3.4" class="f2"/>', brows: 'M19 30h8M36 26l8-2', mouth: 'M29 47a3 3 0 1 0 6 0a3 3 0 1 0-6 0', extra: '<text class="f5" x="52" y="20">?</text>' },
      flat: { eyes: EYES, mouth: 'M24 46h16' }
    };
    function face(kind) {
      var m = MOODS[kind];
      return '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29" class="f0"/><path class="f1" d="M13 27c2-12 11-18 20-18s17 6 18 17c-6-1-10-4-13-9-5 6-14 9-25 10z"/>' +
        m.eyes + (m.brows ? '<path class="f3" d="' + m.brows + '"/>' : '') + '<path class="' + (m.fill ? 'f6' : 'f3') + '" d="' + m.mouth + '"/>' + (m.extra || '') + '</svg>';
    }
    function tough(plan) { return TOUGH.filter(function (t) { return plan.indexOf(t[0]) > -1 && plan.indexOf(t[1]) > -1; }); }

    /* Best assignment of courses to requirement slots: most courses counted, specific requirements before the elective. */
    function match(plan) {
      var best = { score: -1, slot: [] };
      (function go(i, used, slot, score) {
        if (i === plan.length) { if (score > best.score) best = { score: score, slot: slot.slice() }; return; }
        var ok = COURSES[plan[i]];
        for (var k = 0; k < SLOTS.length; k++) if (!used[k] && ok.indexOf(SLOTS[k][0]) > -1) {
          used[k] = 1; slot[i] = k; go(i + 1, used, slot, score + 10 + (SLOTS[k][0] === 'elec' ? 0 : 1)); used[k] = 0;
        }
        slot[i] = -1; go(i + 1, used, slot, score);
      })(0, [], [], 0);
      var counted = best.slot.filter(function (k) { return k > -1; }).length;
      return { slot: best.slot, counted: counted * CR, total: plan.length * CR };
    }
    function verdict(plan) {
      var m = match(plan), out = plan.filter(function (c, i) { return m.slot[i] < 0; });
      if (!plan.length) return 'there are no courses in the plan.';
      if (out.length) return out.join(' and ') + (out.length > 1 ? ' do' : ' does') + ' not count toward the degree.';
      if (m.counted < MIN) return m.counted + ' counted credits is under the ' + MIN + ' minimum.';
      return '';
    }
    box.innerHTML =
      '<div class="cd-sb"><div class="cd-sbcol">' +
      '<div class="cd-brief"><b>Sam, Data Science major</b><span>This semester he needs 2 major core courses, 1 math, 1 general education, and 1 elective, for at least ' + MIN + ' credits. Every course is 3 credits.</span></div>' +
      '<div class="cd-sam"><span class="cd-face"></span><p class="cd-say" aria-live="polite"></p></div>' +
      '<div class="cd-pick"><span>Courses: click to add or remove</span><div class="cd-elect"></div></div>' +
      '<div class="cd-sbh cd-mt"><b>How the courses count</b><span class="cd-eff"></span></div><ul class="cd-match"></ul>' +
      '<div class="cd-act"><div class="cd-msg" aria-live="polite"></div><div class="cd-ctrl cd-wrap"><button type="button" class="cd-btn go" data-a="approve">Request school approval</button><button type="button" class="cd-btn" data-a="revert">Revert to last approved</button></div></div></div>' +
      '<div class="cd-sbcol"><div class="cd-sbh"><b>Version history</b><span>My part: every plan kept</span></div><ol class="cd-vers"></ol></div></div>';
    var q = function (x) { return box.querySelector(x); };
    function target() { for (var k = at - 2; k >= 0; k--) if (versions[k].ok) return versions[k]; return null; }
    function draw() {
      var me = versions[at - 1], m = match(cur), mood, say, hard = tough(cur);
      var off = cur.filter(function (c) { return !COURSES[c].length; }), pair = hard.length ? hard[0].join(' and ') : '';
      if (me.ok && hard.length) { mood = 'tough'; say = 'Approved, but ' + pair + ' together will be a rough semester.'; }
      else if (me.ok) { mood = 'happy'; say = 'Approved. This is the plan I am taking.'; }
      else if (!cur.length) { mood = 'flat'; say = 'An empty semester? Help me pick some courses.'; }
      else if (off.length) { mood = 'lost'; say = off.join(' and ') + '? That is not part of my major.'; }
      else if (m.total > m.counted) { mood = 'sad'; say = 'I would be paying for ' + (m.total - m.counted) + ' credits that do not count toward my degree.'; }
      else if (m.counted < MIN) { mood = 'flat'; say = 'Everything counts, but I need ' + (MIN - m.counted) + ' more credits to stay on pace.'; }
      else if (hard.length) { mood = 'tough'; say = 'It all counts, but ' + pair + ' in the same semester? That is a heavy load.'; }
      else { mood = 'good'; say = 'Every course counts and I have enough credits. Can we get it approved?'; }
      q('.cd-face').innerHTML = face(mood); q('.cd-face').setAttribute('data-mood', mood); q('.cd-say').innerHTML = '<b>Sam</b> ' + say;
      q('.cd-elect').innerHTML = NAMES.map(function (c) {
        var inp = cur.indexOf(c) > -1;
        return '<button type="button" class="cd-el" data-c="' + c + '" aria-pressed="' + inp + '"><b>' + (inp ? '− ' : '+ ') + c + '</b><small>' + TITLE[c] + '</small></button>';
      }).join('');
      q('.cd-eff').textContent = m.counted + ' of ' + m.total + ' credits count' + (m.total ? ' (' + Math.round(m.counted / m.total * 100) + '%)' : '');
      q('.cd-match').innerHTML = cur.length ? cur.map(function (c, i) {
        var k = m.slot[i];
        return '<li class="' + (k < 0 ? 'no' : '') + '"><span class="cd-course">' + c + '</span><span>' + (k > -1 ? 'fills <b>' + SLOTS[k][1] + '</b>'
          : COURSES[c].length ? 'does not count: that requirement is already filled' : 'does not count: not in this program’s curriculum') + '</span></li>';
      }).join('') + hard.map(function (t) { return '<li class="warn"><span class="cd-course">' + t[0] + ' + ' + t[1] + '</span><span>tough combination: allowed, but a heavy load</span></li>'; }).join('')
        : '<li class="no"><span>No courses yet.</span></li>';
      q('.cd-vers').innerHTML = versions.slice().reverse().map(function (v) {
        return '<li class="' + (v.n === at ? 'on' : '') + '"><span class="cd-vtag">v' + v.n + '</span><span class="cd-vnote">' + v.note + '<small>' + v.plan.length * CR + ' credits</small></span>' +
          '<span class="cd-st' + (v.ok ? ' ok' : '') + '">' + (v.ok ? 'Approved' : 'Draft') + '</span>' + (v.n === at ? '<span class="cd-now">Current</span>' : '') + '</li>';
      }).join('');
      q('[data-a=approve]').disabled = me.ok;
      var t = target(), rb = q('[data-a=revert]');
      rb.disabled = !t; rb.textContent = t ? 'Revert to last approved (v' + t.n + ')' : 'Revert to last approved';
      q('.cd-msg').textContent = msg;
    }
    box.addEventListener('click', function (e) {
      var hit = e.target.closest ? e.target.closest('[data-a],[data-c]') : e.target; if (!hit) return;
      var a = hit.getAttribute('data-a'), c = hit.getAttribute('data-c');
      if (c) {
        var k = cur.indexOf(c), n = versions.length + 1;
        if (k > -1) cur.splice(k, 1); else { if (cur.length >= 7) { msg = 'Seven courses is the most this sandbox allows.'; draw(); return; } cur.push(c); }
        versions.push({ n: n, note: (k > -1 ? 'Removed ' : 'Added ') + c, plan: cur.slice(), ok: false }); at = n;
        msg = 'Saved as v' + n + '. It stays a draft until the school approves it.';
      } else if (a === 'approve') {
        var why = verdict(cur);
        if (why) msg = 'Not approved: ' + why; else { versions[at - 1].ok = true; msg = 'Approved: every course counts and the credit minimum is met.' + (tough(cur).length ? ' The school does not block a tough combination.' : ''); }
      } else if (a === 'revert') {
        var t = target(); if (!t) return; cur = t.plan.slice(); at = t.n; msg = 'Reverted to v' + t.n + ', the previously approved plan.';
      } else return;
      draw();
    });
    /* The game opens from a teaser card: a window over the page on desktop, full screen on phones. A link ending in #try opens it directly. The frame is moved to <body> so the band's clipping does not cut it off. */
    var frame = box.parentNode, home = frame.parentNode, mq = window.matchMedia('(max-width:640px)'), shell = null, opener = null;
    if (frame.classList && frame.classList.contains('cd-gbox')) {
      var tease = el('div', 'cd-tease', '<span class="cd-face" data-mood="good">' + face('good') + '</span><div><b>Play the mini game</b><span>Pick Sam’s courses and watch him react. It takes about two minutes.</span></div><button type="button" class="cd-btn go">Try it</button>');
      home.insertBefore(tease, frame);
      var closeBtn = frame.querySelector('.cd-close');
      var shut = function () {
        if (!shell) return;
        home.insertBefore(frame, tease.nextSibling); document.body.removeChild(shell); shell = null;
        document.documentElement.classList.remove('cd-lock');
        if (location.hash === '#try') history.replaceState(null, '', location.pathname + location.search);
        if (opener && opener.focus) opener.focus();
      };
      var teaseBtn = tease.querySelector('button');
      var openGame = function (from) {
        if (shell) return;
        opener = from || teaseBtn; shell = el('div', 'cd-modal'); shell.setAttribute('role', 'dialog'); shell.setAttribute('aria-modal', 'true'); shell.setAttribute('aria-label', 'Mini game: help Sam plan a semester');
        shell.appendChild(frame); document.body.appendChild(shell); document.documentElement.classList.add('cd-lock');
        shell.addEventListener('mousedown', function (e) { if (e.target === shell) shut(); });
        box.scrollTop = 0; if (closeBtn) closeBtn.focus();
      };
      teaseBtn.addEventListener('click', function () { openGame(this); });
      document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href="#try"]');
        if (a) { e.preventDefault(); openGame(a); }
      });
      var fromHash = function () { if (location.hash === '#try') openGame(null); };
      window.addEventListener('hashchange', fromHash);
      if (closeBtn) closeBtn.addEventListener('click', shut);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(); });
      draw(); fromHash(); return;
    }
    draw();
  }

  function boot() {
    var f = document.getElementById('cd-flow'), p = document.getElementById('cd-pace');
    if (f) initFlow(f); if (p) initPace(p);
    var sb = document.getElementById('cd-sandbox'); if (sb) initSandbox(sb);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(this);
