import { useEffect, useMemo, useState } from 'react';
import projectSeedData from '../projects/projects.json';

const skillGroups = [
  { title: 'CMS', items: ['WordPress'] },
  { title: 'バックエンド', items: ['PHP', 'Laravel', 'C# .NET', 'Python'] },
  { title: 'フロントエンド', items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js'] },
  { title: 'データベース', items: ['MySQL'] },
  { title: 'Web・外部連携', items: ['REST API', 'API連携', '外部サービス連携'] },
  { title: 'EC・AI活用', items: ['WooCommerce', 'EC機能カスタマイズ', '生成AI', 'LLM', 'AI API連携'] },
];

const filters = ['all', 'ウェブ制作', 'システム開発', 'AI関連'];

function normalizeCategory(value) {
  return value === 'AI・連携' ? 'AI関連' : value;
}

function App() {
  const [projects] = useState(projectSeedData);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [dialogOrigin, setDialogOrigin] = useState({ x: '50%', y: '50%' });
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactType, setContactType] = useState('');
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [pageSize, setPageSize] = useState(() => (typeof window === 'undefined' ? 3 : window.innerWidth <= 520 ? 1 : 3));

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth <= 520 ? 1 : 3);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((project) => normalizeCategory(project.category) === filter);
  }, [filter, projects]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredProjects.length / pageSize)), [filteredProjects.length, pageSize]);

  useEffect(() => {
    setPage(0);
  }, [filter]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages - 1));
  }, [totalPages]);

  const visibleProjects = filteredProjects.slice(page * pageSize, page * pageSize + pageSize);

  const openProjectDialog = (project, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDialogOrigin({
      x: `${rect.left + rect.width / 2}px`,
      y: `${rect.top + rect.height / 2}px`,
    });
    setSelectedProject(project);
  };

  const contactDetails =
    contactType === 'gmail'
      ? {
          title: 'Gmailで相談',
          text: 'メールアプリを開かず、この画面で宛先と内容を確認できます。',
          strongs: ['送信先', '相談内容'],
          values: ['geneldilsah@gmail.com', 'Web制作・Webシステム開発・AI活用について'],
          href: 'mailto:geneldilsah@gmail.com',
          actionText: 'メールを作成する ↗',
        }
      : {
          title: 'Chatworkで相談',
          text: 'Chatworkの連携先を確認してから、相談画面へ進めます。',
          strongs: ['Chatwork連携先', 'プロフィール'],
          values: ['miracledayo225', 'https://www.chatwork.com/miracledayo225'],
          href: 'https://www.chatwork.com/miracledayo225',
          actionText: 'Chatworkを開く ↗',
        };

  useEffect(() => {
    const cursor = document.querySelector('.cursor-cloud');
    const trail = document.querySelector('.cursor-trail');

    if (!cursor || !trail) {
      return undefined;
    }

    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let trailX = cursorX;
    let trailY = cursorY;

    const updatePointerPosition = (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    };

    const handlePointerMove = (event) => {
      updatePointerPosition(event);
    };

    const handlePointerDown = (event) => {
      if (event.pointerType === 'touch') {
        return;
      }

      cursor.classList.add('is-pressed');

      for (let index = 0; index < 18; index += 1) {
        const puff = document.createElement('span');
        const angle = (Math.PI * 2 * index) / 18;
        const distance = 14 + Math.random() * 30;
        const deltaX = Math.cos(angle) * distance;
        const deltaY = Math.sin(angle) * distance;

        puff.className = 'glass-burst';
        puff.style.left = `${event.clientX}px`;
        puff.style.top = `${event.clientY}px`;
        puff.style.setProperty('--dx', `${deltaX}px`);
        puff.style.setProperty('--dy', `${deltaY}px`);
        puff.style.setProperty('--dr', `${(Math.random() - 0.5) * 260}deg`);
        puff.style.setProperty('--scale', `${0.8 + Math.random() * 1.8}`);
        puff.style.setProperty('--alpha', `${0.8 + Math.random() * 0.2}`);
        document.body.appendChild(puff);

        const removeBurst = () => {
          if (puff.isConnected) {
            puff.remove();
          }
        };

        puff.addEventListener('animationend', removeBurst);
        window.setTimeout(removeBurst, 820);
      }
    };

    const handlePointerUp = () => {
      cursor.classList.remove('is-pressed');
    };

    const animateCursor = () => {
      trailX += (cursorX - trailX) * 0.18;
      trailY += (cursorY - trailY) * 0.18;
      trail.style.left = `${trailX}px`;
      trail.style.top = `${trailY}px`;
      window.requestAnimationFrame(animateCursor);
    };

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    trail.style.left = `${trailX}px`;
    trail.style.top = `${trailY}px`;

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);
    window.requestAnimationFrame(animateCursor);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <>
      <div className="cursor-cloud" aria-hidden="true" />
      <div className="cursor-trail" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Susanoo ホーム">
          SUSANOO <span>/</span> ポートフォリオ
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-controls="site-nav"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
          <b>Menu</b>
        </button>
        <nav id="site-nav" className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="メインナビゲーション">
          <a href="#about" onClick={() => setMenuOpen(false)}>私について</a>
          <a href="#skills" onClick={() => setMenuOpen(false)}>技術</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>対応内容</a>
          <a href="#process" onClick={() => setMenuOpen(false)}>進め方</a>
          <a href="#works" onClick={() => setMenuOpen(false)}>制作実績</a>
          <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>
            お問い合わせ <span>↗</span>
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-shell">
          <div className="hero-copy">
            <p className="eyebrow">Web制作 / システム開発</p>
            <h1>
              Web制作から
              <br />
              システム開発
              <br />
              <em>まで。</em>
            </h1>
            <p className="hero-lead">AIを活用しながら、企画・設計・開発・公開まで対応します。</p>
            <p className="hero-text">
              8年以上のWeb制作・システム開発経験をもとに、案件に合わせた技術選定と丁寧な実装を行います。
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#works">
                制作実績を見る <span>↗</span>
              </a>
              <a className="text-link" href="#contact">
                相談する <span>→</span>
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-label="Web開発のイメージ">
            <div className="hero-cloud cloud-one" />
            <div className="hero-cloud cloud-two" />
            <div className="hero-cloud cloud-three" />
            <div className="visual-grid" />
            <div className="code-card">
              <span>01</span>
              <code>
                {'const '}
                <strong>solution</strong>
                {' = await'}
                <br />
                {'build({'}
                <br />
                {'  clarity: true,'}
                <br />
                {'  quality: true'}
                <br />
                {'});'}
              </code>
            </div>
            <div className="visual-note">
              <b>
                AIと技術で
                <br />
                未来をつくる
              </b>
              <span>要件から、丁寧に。</span>
            </div>
          </div>

          <div className="hero-meta">
            <span>スクロールしてご覧ください</span>
            <span className="line" />
            <span>01 — 07</span>
          </div>
        </section>

        <section id="about" className="section-shell section about-section">
          <div className="about-identity">
            <figure className="about-landscape">
              <img
                src="https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1200&q=85"
                alt="富士山と湖の日本の自然風景"
                loading="lazy"
              />
              <figcaption>JAPAN / NATURE</figcaption>
            </figure>
            <div className="section-intro">
              <p className="eyebrow">01 / ABOUT ME</p>
              <h2>
                技術だけでなく、
                <br />
                進め方まで考える。
              </h2>
            </div>
          </div>
          <div className="about-content">
            <p className="lead-copy">
              8年間にわたり、Webシステム開発・Webサイト制作・サービス開発に携わってきたフルスタックエンジニアです。
            </p>
            <p>
              WordPressを使ったWebサイト制作から、PHP / LaravelによるWebシステム開発、JavaScript / React / Next.jsによるフロントエンド開発まで、企画・設計・実装・テスト・公開後の改善を一貫して対応しています。
            </p>
            <p>
              ご相談内容をそのまま形にするだけではなく、現在の環境や要件を確認し、既存機能・プラグイン・カスタム開発の選択肢を整理したうえで、目的に合った実装方法をご提案します。AIも調査や実装、デバッグに活用しながら、最終的な品質確認は人が責任を持って行います。
            </p>
            <div className="trust-list">
              <span>8年以上の経験</span>
              <span>要件整理から公開まで</span>
              <span>AI活用と人による品質確認</span>
            </div>
          </div>
        </section>

        <section id="skills" className="section-shell section light-section">
          <div className="section-heading">
            <p className="eyebrow">02 / 技術</p>
            <h2>
              案件に合わせて、
              <br />
              <em>選び、組み立てる。</em>
            </h2>
          </div>
          <div className="skill-grid" id="skillsContainer">
            {skillGroups.map((group) => (
              <article className="skill-group" key={group.title}>
                <h3>{group.title}</h3>
                <div className="tags">
                  {group.items.map((item) => (
                    <span className="tag" key={`${group.title}-${item}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="section-shell section">
          <div className="section-heading">
            <p className="eyebrow">03 / 対応内容</p>
            <h2>任せられる範囲を、明確に。</h2>
          </div>
          <div className="service-grid">
            <article>
              <span className="service-no">01</span>
              <h3>Webサイト制作</h3>
              <p>事業や目的に合わせた、伝わるWebサイトを構築します。</p>
              <ul>
                <li>WordPressサイト / LP / ブログ</li>
                <li>コーポレートサイト</li>
                <li>カスタマイズ / レスポンシブ対応</li>
              </ul>
            </article>
            <article>
              <span className="service-no">02</span>
              <h3>Webシステム開発</h3>
              <p>業務に必要な機能を整理し、扱いやすいWebアプリへ。</p>
              <ul>
                <li>業務システム / 管理画面</li>
                <li>データ処理 / API連携</li>
                <li>外部サービス連携</li>
              </ul>
            </article>
            <article>
              <span className="service-no">03</span>
              <h3>ECサイト</h3>
              <p>販売・注文・決済に関わる機能を、環境に合わせて改善します。</p>
              <ul>
                <li>WooCommerce / EC構築</li>
                <li>EC機能カスタマイズ</li>
                <li>決済・注文 / 外部連携</li>
              </ul>
            </article>
            <article>
              <span className="service-no">04</span>
              <h3>改善・AI活用</h3>
              <p>既存環境を調査し、必要なところから無理なく改善します。</p>
              <ul>
                <li>不具合 / 表示速度 / コード改善</li>
                <li>LLM / AI API連携</li>
                <li>AIを活用した業務効率化</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="process" className="section-shell section process-section light-section">
          <div className="section-heading">
            <p className="eyebrow">04 / 進め方</p>
            <h2>
              いきなり作らない。
              <br />
              <em>まず、状況を理解する。</em>
            </h2>
            <p className="section-description">現在の環境・要件・既存機能を確認したうえで、実装方法を検討します。</p>
          </div>
          <div className="process-list">
            <div>
              <b>01</b>
              <h3>ヒアリング・要件整理</h3>
              <p>目的と課題を言語化します。</p>
            </div>
            <div>
              <b>02</b>
              <h3>現状分析・課題整理</h3>
              <p>既存環境と制約を確認します。</p>
            </div>
            <div>
              <b>03</b>
              <h3>仕様・実装方法の検討</h3>
              <p>最適な手段を比較します。</p>
            </div>
            <div>
              <b>04</b>
              <h3>設計・開発</h3>
              <p>設計に沿って実装します。</p>
            </div>
            <div>
              <b>05</b>
              <h3>テスト・確認</h3>
              <p>動作と品質を確認します。</p>
            </div>
            <div>
              <b>06</b>
              <h3>公開・納品</h3>
              <p>本番環境へ反映します。</p>
            </div>
            <div>
              <b>07</b>
              <h3>改善・保守</h3>
              <p>公開後も継続支援します。</p>
            </div>
          </div>
        </section>

        <section id="works" className="section-shell section works-section">
          <div className="section-heading heading-row">
            <div>
              <p className="eyebrow">05 / 制作実績</p>
              <h2>
                これまでの成果物。<em>実績は、随時更新します。</em>
              </h2>
            </div>
            <p className="section-description">案件情報は確認できた内容のみ掲載します。詳細はカードを選択してください。</p>
          </div>

          <div className="filter-list" role="group" aria-label="実績の絞り込み">
            {filters.map((option) => (
              <button
                key={option}
                type="button"
                className={`filter-button ${filter === option ? 'is-active' : ''}`}
                onClick={() => setFilter(option)}
              >
                {option === 'all' ? 'すべて' : option}
              </button>
            ))}
          </div>

          <div className="work-carousel" aria-label="制作実績カルーセル">
            <button
              type="button"
              className="work-nav-button"
              aria-label="前の制作実績"
              disabled={page === 0 || filteredProjects.length === 0}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
            >
              ←<span>前へ</span>
            </button>

            <div className="work-stage">
              <div className="work-grid">
                {visibleProjects.map((project, index) => (
                  <article
                    className={`work-card ${project.placeholder ? 'is-placeholder' : ''}`}
                    key={`${project.name}-${index}`}
                    tabIndex={0}
                    role="button"
                    onClick={(event) => openProjectDialog(project, event)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openProjectDialog(project, event);
                      }
                    }}
                  >
                    <div className="work-top">
                      <span>{String(page * pageSize + index + 1).padStart(2, '0')}</span>
                      <span>{project.category}</span>
                    </div>
                    {project.screenshot && project.screenshot !== '画像を追加' ? (
                      <img className="work-screenshot" src={project.screenshot} alt={`${project.name}のスクリーンショット`} loading="lazy" />
                    ) : (
                      <div className="work-screenshot-placeholder">スクリーンショットを追加</div>
                    )}
                    <div>
                      <h3>{project.name}</h3>
                      <p>{project.overview}</p>
                      <div className="work-tags">
                        {project.technologies.map((tag) => (
                          <span key={`${project.name}-${tag}`}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="work-nav-button"
              aria-label="次の制作実績"
              disabled={page >= totalPages - 1 || filteredProjects.length === 0}
              onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
            >
              <span>次へ</span>→
            </button>
          </div>

          <p className="work-position" aria-live="polite">
            {filteredProjects.length ? `${page + 1} / ${totalPages}` : '0 / 0'}
          </p>
        </section>

        <section className="section-shell section ai-section">
          <div>
            <p className="eyebrow">06 / AI活用</p>
            <h2>
              AIを使う。
              <br />
              <em>品質確認は、</em>
              <br />
              <em>人が行う。</em>
            </h2>
          </div>
          <div>
            <p className="lead-copy">生成AI・LLM・AI APIを、開発の現場で役立つ道具として具体的に活用します。</p>
            <p>
              要件や既存コードの調査、実装方針の比較、コード作成、テストケースの整理、デバッグ、ドキュメント作成までAIを活用して効率化します。AI APIを使った業務効率化やWebサービスの機能設計にも対応し、出力内容は要件・セキュリティ・保守性の観点から人が確認して品質を担保します。
            </p>
          </div>
        </section>

        <section id="contact" className="section-shell section contact-section">
          <div>
            <p className="eyebrow">07 / お問い合わせ</p>
            <h2>
              まずは、課題を
              <br />
              <em>聞かせてください。</em>
            </h2>
            <p>Webサイト制作・システム開発・既存サイトの改善など、お気軽にご相談ください。</p>
          </div>
          <div className="contact-card">
            <span>連絡先を選択</span>
            <div className="contact-options">
              <button
                className="contact-option gmail-option"
                type="button"
                onClick={() => { setContactType('gmail'); setContactDialogOpen(true); setMenuOpen(false); }}
              >
                <span className="contact-icon gmail-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 24" role="img">
                    <path d="M2 5.2A3.2 3.2 0 0 1 5.2 2h21.6A3.2 3.2 0 0 1 30 5.2v13.6a3.2 3.2 0 0 1-3.2 3.2H5.2A3.2 3.2 0 0 1 2 18.8Z" fill="#fff" />
                    <path d="M3.5 4.5 16 14 28.5 4.5" fill="none" stroke="#ea4335" strokeWidth="3" />
                    <path d="M3.5 19.5 12.5 12.7M28.5 19.5 19.5 12.7" fill="none" stroke="#4285f4" strokeWidth="3" />
                    <path d="M3.5 4.5v15M28.5 4.5v15" fill="none" stroke="#34a853" strokeWidth="3" />
                  </svg>
                </span>
                <span>
                  <strong>Gmailで相談</strong>
                  <small>メール連携の項目を表示</small>
                </span>
                <b>↗</b>
              </button>
              <button
                className="contact-option chatwork-option"
                type="button"
                onClick={() => { setContactType('chatwork'); setContactDialogOpen(true); setMenuOpen(false); }}
              >
                <span className="contact-icon chatwork-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 24" role="img">
                    <circle cx="9" cy="8" r="4.2" fill="#ff5263" />
                    <circle cx="20" cy="7" r="4.2" fill="#ff5263" />
                    <circle cx="14" cy="15.5" r="4.2" fill="#ff5263" />
                    <circle cx="24" cy="16" r="4.2" fill="#ff5263" />
                    <circle cx="5" cy="17" r="3.2" fill="#ff5263" />
                  </svg>
                </span>
                <span>
                  <strong>Chatworkで相談</strong>
                  <small>Chatwork連携の項目を表示</small>
                </span>
                <b>↗</b>
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <a className="brand" href="#top">
          SUSANOO <span>/</span> ポートフォリオ
        </a>
        <p>Web制作とシステム開発を、丁寧に。</p>
        <span>© 2026 Susanoo</span>
      </footer>

      {selectedProject && (
        <div
          className="project-dialog is-open"
          role="dialog"
          aria-modal="true"
          style={{ '--dialog-origin-x': dialogOrigin.x, '--dialog-origin-y': dialogOrigin.y }}
          onClick={(event) => event.target === event.currentTarget && setSelectedProject(null)}
        >
          <button type="button" className="dialog-close" aria-label="詳細を閉じる" onClick={() => setSelectedProject(null)}>
            ×
          </button>
          <div className="dialog-inner" id="dialogContent">
            <p className="eyebrow">{selectedProject.category}</p>
            <h2>{selectedProject.name}</h2>
            <p className="lead-copy">{selectedProject.overview}</p>
            <div className="dialog-grid">
              <div>
                <h3>使用技術スタック</h3>
                <div className="dialog-tags">
                  {selectedProject.technologies.map((tag) => (
                    <span key={`${selectedProject.name}-${tag}`}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {contactDialogOpen && contactType && (
        <div
          className="contact-dialog is-open"
          role="dialog"
          aria-modal="true"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setContactDialogOpen(false);
              setContactType('');
            }
          }}
        >
          <button
            type="button"
            className="dialog-close contact-dialog-close"
            aria-label="連携画面を閉じる"
            onClick={() => {
              setContactDialogOpen(false);
              setContactType('');
            }}
          >
            ×
          </button>
          <div className="contact-dialog-content">
            <p className="eyebrow">お問い合わせ連携</p>
            <div className="contact-dialog-icon" id="contactDialogIcon">
              <svg viewBox="0 0 32 24" aria-hidden="true">
                <path d="M2 5.2A3.2 3.2 0 0 1 5.2 2h21.6A3.2 3.2 0 0 1 30 5.2v13.6a3.2 3.2 0 0 1-3.2 3.2H5.2A3.2 3.2 0 0 1 2 18.8Z" fill="#fff" />
                <path d="M3.5 4.5 16 14 28.5 4.5" fill="none" stroke="#ea4335" strokeWidth="3" />
                <path d="M3.5 19.5 12.5 12.7M28.5 19.5 19.5 12.7" fill="none" stroke="#4285f4" strokeWidth="3" />
                <path d="M3.5 4.5v15M28.5 4.5v15" fill="none" stroke="#34a853" strokeWidth="3" />
              </svg>
            </div>
            <h2>{contactDetails.title}</h2>
            <p>{contactDetails.text}</p>
            <div className="contact-details">
              {contactDetails.strongs.map((label, index) => (
                <div key={label}>
                  <strong>{label}</strong>
                  <span>{contactDetails.values[index]}</span>
                </div>
              ))}
            </div>
            <a
              className="button button-dark"
              href={contactDetails.href}
              target={contactType === 'chatwork' ? '_blank' : undefined}
              rel={contactType === 'chatwork' ? 'noreferrer' : undefined}
            >
              {contactDetails.actionText} <span>↗</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
