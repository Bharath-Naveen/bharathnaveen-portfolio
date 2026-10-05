<div align="center">
  <img src="https://raw.githubusercontent.com/Bharath-Naveen/Bharath-Naveen/main/github-header-anim_1.gif" alt="Bharath Naveen, Data Scientist, ML Engineer, Data Analyst, Forward Deployed Engineer" width="100%">
</div>

<p align="center">
  <a href="https://bharathnaveen.com"><img src="https://img.shields.io/badge/Portfolio-bharathnaveen.com-0E7C86?style=flat&logoColor=white"></a>
  <a href="https://www.linkedin.com/in/bharath-naveen/"><img src="https://img.shields.io/badge/LinkedIn-0E7C86?style=flat&logo=linkedin&logoColor=white"></a>
  <a href="mailto:bharathnaveen.bn@gmail.com"><img src="https://img.shields.io/badge/Email-0E7C86?style=flat&logo=gmail&logoColor=white"></a>
</p>

<p align="center">
  <b>Now:</b> designing evaluation challenges for large language models on contract with <b>Handshake AI</b> &nbsp;·&nbsp; <a href="https://bharathnaveen.com/post.html?slug=trying-to-make-ai-fail">Read what it taught me</a>
</p>

<h2>About me</h2>
<p>I build <strong>data and machine learning systems</strong>, from database design and data pipelines to modeling and evaluation. I came to data through mechanical engineering and <strong>3+ years at Tata Consultancy Services on the Microsoft account</strong>, so I care as much about clean pipelines, data validation, and clear communication as I do about the model itself. I hold an <strong>MS in Information Science (Machine Learning)</strong> from the University of Arizona, and I&#39;m currently doing <strong>LLM evaluation</strong> work with Handshake AI, designing evaluation challenges for model reasoning and writing structured feedback on model behavior. I&#39;m open to <strong>Data Scientist, Machine Learning Engineer, Data Analyst, and Forward Deployed Engineer</strong> roles.</p>
<p>Full writeups on <strong><a href="https://bharathnaveen.com">bharathnaveen.com</a></strong>.</p>
<table>
<thead>
<tr>
<th>Core stack</th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Languages</strong></td>
<td>Python (pandas, NumPy), SQL (CTEs, window functions)</td>
</tr>
<tr>
<td><strong>ML &amp; modeling</strong></td>
<td>scikit-learn, XGBoost, LightGBM, Random Forest, Gradient Boosting, SVM, Logistic Regression, model evaluation</td>
</tr>
<tr>
<td><strong>AI evaluation</strong></td>
<td>LLM evaluation, evaluation-challenge design, blind validation, ablation-style testing, structured feedback</td>
</tr>
<tr>
<td><strong>Data &amp; cloud</strong></td>
<td>AWS (Lambda, DynamoDB, S3), Docker, Docker Compose, Git, CI/CD, MySQL, ER modeling</td>
</tr>
<tr>
<td><strong>BI &amp; delivery</strong></td>
<td>Power BI, Excel, Streamlit, Playwright, BeautifulSoup, pytest</td>
</tr>
</tbody>
</table>
<hr />
<h2>Currently: AI evaluation</h2>
<table>
<tr><th align="left"><a href="https://bharathnaveen.com/post.html?slug=trying-to-make-ai-fail">LLM Evaluation, Handshake AI</a> &nbsp; <sub>ML Engineer · Data Scientist · FDE</sub></th></tr>
<tr><td>
<b>Problem:</b> Strong language models are easy to trip up with trick questions, but that says nothing about real reliability. The useful question is how they hold up on <b>fair</b> tests, with one clear right answer and nothing hidden.<br>
<b>Doing:</b> Designing evaluation challenges that test <b>LLM reasoning</b>, and writing <b>structured feedback</b> on model behavior. Built a repeatable testing process along the way: <b>blind checks</b> against the answer key, one-variable-at-a-time comparisons, <b>ablation</b> of each challenge component, leak checks on my own setup, and a running failure log.<br>
<b>Skills:</b> <code>LLM evaluation</code> <code>Evaluation design</code> <code>Validation design</code> <code>Ablation testing</code> <code>Data leakage checks</code> <code>Technical writing</code>
</td></tr>
</table>

<hr />
<h2>Featured work</h2>
<table>
<tr><th align="left"><a href="https://github.com/Bharath-Naveen/containerized-phishing-project">Phishing Detection System</a> &nbsp; <sub>Data Scientist · ML Engineer · FDE</sub></th></tr>
<tr><td>
<b>Problem:</b> Phishing sites appear and disappear within hours, faster than blocklists can react, and naive URL classifiers over-flag legitimate, modern JavaScript-heavy pages.<br>
<b>Built:</b> A five-layer detection system (solo MS capstone, 2026): supervised ML triage with four models (<b>LightGBM, XGBoost, Random Forest, Logistic Regression</b>) on 59 URL and host features from a ~800K-URL dataset, live page capture with <b>Playwright</b>, HTML and DOM behavior analysis, rule-based brand-impersonation checks, and a deterministic evidence-adjudication layer that returns explainable likely-phishing, uncertain (routed to review), or likely-legitimate verdicts. Domain-grouped splits reduce leakage. I prototyped LLM brand inference, then replaced it with deterministic rules for reproducibility. Containerized with <b>Docker</b>, surfaced through a <b>Streamlit</b> dashboard, and covered by 250+ automated tests.<br>
<b>Skills:</b> <code>Python</code> <code>LightGBM</code> <code>XGBoost</code> <code>Feature engineering</code> <code>Model evaluation</code> <code>Playwright</code> <code>Docker</code> <code>Streamlit</code> <code>pytest</code>
</td></tr>
</table>

<table>
<tr><th align="left"><a href="https://github.com/Bharath-Naveen/cohort-analytics">Cohort Analytics Platform</a> &nbsp; <sub>Data Analyst · ML Engineer · FDE</sub></th></tr>
<tr><td>
<b>Problem:</b> A University of Arizona platform that tracks whether students are on pace for their degrees needed restructuring, so data science and ML work could be added to it later.<br>
<b>Prototyped:</b> As a student contributor on a Vertically Integrated Projects team (spring 2026), built and tested a backend prototype: an <b>AWS Lambda</b> function with a new <b>DynamoDB</b> table and version history in <b>S3</b>, so every degree plan is stored and can revert to the previously approved one. The legacy design kept no plan history, only whole-table backups. It is a prototype, not a production release. The existing platform was built by the university team and is university-owned.<br>
<b>Skills:</b> <code>AWS Lambda</code> <code>DynamoDB</code> <code>S3</code> <code>Serverless</code> <code>Backend prototyping</code>
</td></tr>
</table>

<table>
<tr><th align="left"><a href="https://github.com/Bharath-Naveen/youtube-comment-spam-detector">YouTube Comment Spam Detector</a> &nbsp; <sub>planned · Data Scientist · ML Engineer</sub></th></tr>
<tr><td>
<b>Planned, not built yet:</b> a classifier to flag phishing-scam, adult-bait, and engagement-spam YouTube comments, labeled with rule-based weak supervision and evaluated for recall on the high-risk categories, since a missed scam costs more than a false alarm.
</td></tr>
</table>

<table>
<tr><th align="left"><a href="https://github.com/Bharath-Naveen/AutoRisk">AutoRisk</a> &nbsp; <sub>in progress · Data Scientist · ML Engineer · FDE</sub></th></tr>
<tr><td>
<b>Problem:</b> First-time student buyers on a $5k to $10k budget cannot easily judge which cheap used car is a reliable, safe bet.<br>
<b>Built so far:</b> An <b>NHTSA</b> ingestion pipeline that pulls complaints, recalls, and investigations for 30 popular 2012 to 2014 models into structured CSVs. Next: complaint clustering, a depreciation model, a composite reliability score, and a simple app.<br>
<b>Skills:</b> <code>Python</code> <code>API ingestion</code> <code>pandas</code>
</td></tr>
</table>

<hr />
<h2>More projects</h2>
<table>
<tr><th align="left"><a href="https://github.com/Bharath-Naveen/bn_motors_SQL">BN Motors SQL</a> &nbsp; <sub>Data Analyst · Data Scientist</sub></th></tr>
<tr><td>
<b>Problem:</b> A multi-store dealership&#39;s sales, service, financing, and parts data needs one reliable model to report from.<br>
<b>Built:</b> A normalized <b>25-table relational database</b> designed from the ER model up (<b>MySQL 8</b>, personal project, 2025), with 10 analytical queries (joins, <b>window functions, CTEs</b>, subqueries) and 3 reporting views: inventory aging, sales with gross profit and a finance flag, and customer lifetime value. Finance penetration and the lead-to-sale funnel are standalone queries. Seed data is next.<br>
<b>Skills:</b> <code>MySQL</code> <code>SQL</code> <code>ER modeling</code> <code>Schema design</code> <code>Window functions</code> <code>CTEs</code>
</td></tr>
</table>

<table>
<tr><th align="left"><a href="https://github.com/Bharath-Naveen/german-loan-default-ml-">Loan Default Prediction</a> &nbsp; <sub>Data Scientist · Data Analyst</sub></th></tr>
<tr><td>
<b>Problem:</b> Lenders need to flag likely defaulters early, on imbalanced credit data where accuracy alone is misleading.<br>
<b>Built:</b> A supervised-learning workflow on German Credit data (1,000 borrowers, 26% default rate; academic project, 2025): EDA and preprocessing, then benchmarked <b>five models</b> (Logistic Regression, Decision Tree, Random Forest, SVM, Gradient Boosting) at defaults and tuned the top two for F1. Gradient Boosting came out best at <b>ROC-AUC 0.77</b> (F1 0.42, recall 0.35). Top drivers by Random Forest importance: employment duration, checking-account status, years at residence, age, and loan duration.<br>
<b>Skills:</b> <code>Python</code> <code>scikit-learn</code> <code>Gradient Boosting</code> <code>Random Forest</code> <code>SVM</code> <code>EDA</code> <code>Model evaluation</code>
</td></tr>
</table>

<table>
<tr><th align="left"><a href="https://github.com/Bharath-Naveen/youtube-analytics-pipeline">YouTube Analytics Pipeline</a> &nbsp; <sub>Data Analyst</sub></th></tr>
<tr><td>
<b>Problem:</b> Gathering YouTube performance data by hand does not scale.<br>
<b>Built:</b> A class notebook that pulls stats for the top 50 YouTube results for one search query via the <b>YouTube Data API</b> and exports them to CSV and JSON, then ranks them by comments and likes-to-views ratio.<br>
<b>Skills:</b> <code>Python</code> <code>YouTube Data API</code> <code>pandas</code> <code>Data cleaning</code>
</td></tr>
</table>

<table>
<tr><th align="left"><a href="https://github.com/Bharath-Naveen/tmdb-movie-scraper">TMDB Movie Scraper</a> &nbsp; <sub>Data Analyst</sub></th></tr>
<tr><td>
<b>Problem:</b> Structured movie data is not readily available for downstream analytics.<br>
<b>Built:</b> A web-scraping notebook that collects movie metadata (title, rating, genres, cast) for 100 titles across 5 listing pages and exports it to CSV.<br>
<b>Skills:</b> <code>Python</code> <code>BeautifulSoup</code> <code>Web scraping</code> <code>Data cleaning</code>
</td></tr>
</table>

<hr />
<h2>Experience</h2>
<p><strong>AI Training &amp; Evaluation Contractor, Handshake AI</strong> · Sep 2026 to present<br>
Design evaluation challenges for LLM reasoning and write structured feedback on model behavior. Writeup: <a href="https://bharathnaveen.com/post.html?slug=trying-to-make-ai-fail">What trying to make AI fail taught me about testing models</a>.</p>
<p><strong>Tata Consultancy Services, Microsoft account</strong> · Apr 2021 to Aug 2024<br>
<b>System Engineer, Data and Analytics</b> (Apr 2023 to Aug 2024): built two self-refreshing Power BI dashboards (bug tracking, feature delivery) for Microsoft stakeholders; automated SQL and Python reporting, saving about 3 days of manual effort per reporting cycle; analyzed 300+ test and 180+ defect records per cycle with a cross-functional team of 8.<br>
<b>Associate System Engineer</b> (Jul 2022 to Apr 2023): led 2 analysts on delivery and data-quality standards.<br>
<b>Assistant System Engineer, Trainee</b> (Apr 2021 to Jun 2022): ran 300+ structured checks across Microsoft-product environments.</p>
<hr />
<h2>Open to</h2>
<p><code>Data Scientist</code> · <code>Machine Learning Engineer</code> · <code>Data Analyst</code> · <code>Forward Deployed Engineer</code></p>
<div align="center">
  <img src="https://raw.githubusercontent.com/Bharath-Naveen/Bharath-Naveen/main/footer-anim_1.gif" alt="Turning messy data into decisions. bharathnaveen.com, linkedin.com/in/bharath-naveen, bharathnaveen.bn@gmail.com" width="100%">
</div>
