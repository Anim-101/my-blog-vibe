import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Camera, Calendar, ArrowRight, Compass } from 'lucide-react';
import './JapanTravelMap.css';

// 47 Prefectures coordinates scaled to a relative grid (0 - 100)
const PREFECTURES_DATA = [
  { id: 'hokkaido', nameEn: 'Hokkaido', nameJa: '北海道', x: 84, y: 14, region: 'hokkaido' },
  // Tohoku
  { id: 'aomori', nameEn: 'Aomori', nameJa: '青森県', x: 76, y: 28, region: 'tohoku' },
  { id: 'akita', nameEn: 'Akita', nameJa: '秋田県', x: 72, y: 34, region: 'tohoku' },
  { id: 'iwate', nameEn: 'Iwate', nameJa: '岩手県', x: 77, y: 34, region: 'tohoku' },
  { id: 'yamagata', nameEn: 'Yamagata', nameJa: '山形県', x: 71, y: 40, region: 'tohoku' },
  { id: 'miyagi', nameEn: 'Miyagi', nameJa: '宮城県', x: 76, y: 40, region: 'tohoku' },
  { id: 'fukushima', nameEn: 'Fukushima', nameJa: '福島県', x: 73, y: 47, region: 'tohoku' },
  // Kanto
  { id: 'ibaraki', nameEn: 'Ibaraki', nameJa: '茨城県', x: 73, y: 55, region: 'kanto' },
  { 
    id: 'tochigi', 
    nameEn: 'Tochigi', 
    nameJa: '栃木県', 
    x: 70, 
    y: 53, 
    region: 'kanto',
    isVisited: true,
    date: 'May 2026',
    image: '/photos/tochigi-2026/IMG_20260504_020519_811.jpg',
    details: 'Unlocking the 22nd prefecture. Discovered ancient UNESCO shrines, giant cedars, and rejuvenating hot springs in Nikko.',
    posts: [
      { title: '栃木県 2026 (Tochigi)', slug: 'tochigi-2026' },
      { title: '日光、栃木県。 (Nikko)', slug: 'nikko-2026' }
    ]
  },
  { id: 'gunma', nameEn: 'Gunma', nameJa: '群馬県', x: 67, y: 53, region: 'kanto' },
  { id: 'saitama', nameEn: 'Saitama', nameJa: '埼玉県', x: 69, y: 57, region: 'kanto' },
  { id: 'chiba', nameEn: 'Chiba', nameJa: '千葉県', x: 72, y: 61, region: 'kanto' },
  { 
    id: 'tokyo', 
    nameEn: 'Tokyo', 
    nameJa: '東京都', 
    x: 68, 
    y: 59, 
    region: 'kanto',
    isVisited: true,
    date: 'February 2026',
    image: '/photos/tokyo-snow-2026/shimo-takaido-station.jpg',
    details: 'Immersed in Tokyo’s winter wonderland. Documented Asakusa Senso-ji Temple and urban train crossings covered in heavy snow.',
    posts: [
      { title: '東京雪 2026 (Tokyo Snow)', slug: 'tokyo-snow-2026' }
    ]
  },
  { id: 'kanagawa', nameEn: 'Kanagawa', nameJa: '神奈川県', x: 67, y: 61, region: 'kanto' },
  // Chubu
  { id: 'niigata', nameEn: 'Niigata', nameJa: '新潟県', x: 64, y: 45, region: 'chubu' },
  { id: 'toyama', nameEn: 'Toyama', nameJa: '富山県', x: 57, y: 47, region: 'chubu' },
  { id: 'ishikawa', nameEn: 'Ishikawa', nameJa: '石川県', x: 53, y: 45, region: 'chubu' },
  { id: 'fukui', nameEn: 'Fukui', nameJa: '福井県', x: 49, y: 51, region: 'chubu' },
  { 
    id: 'yamanashi', 
    nameEn: 'Yamanashi', 
    nameJa: '山梨県', 
    x: 63, 
    y: 59, 
    region: 'chubu',
    isVisited: true,
    date: 'November 2025',
    image: '/photos/tokyo-snow-2026/asakusa-sensoji.jpg', // Fallback premium visual
    details: 'Traveled last November. Explored the serene Mt. Fuji region, local craft villages, and beautiful autumn lakeside colors.',
    posts: [] // Explored, no post yet
  },
  { id: 'nagano', nameEn: 'Nagano', nameJa: '長野県', x: 61, y: 53, region: 'chubu' },
  { id: 'gifu', nameEn: 'Gifu', nameJa: '岐阜県', x: 54, y: 54, region: 'chubu' },
  { id: 'shizuoka', nameEn: 'Shizuoka', nameJa: '静岡県', x: 61, y: 62, region: 'chubu' },
  { id: 'aichi', nameEn: 'Aichi', nameJa: '愛知県', x: 54, y: 60, region: 'chubu' },
  // Kansai
  { id: 'shiga', nameEn: 'Shiga', nameJa: '滋賀県', x: 49, y: 56, region: 'kansai' },
  { id: 'mie', nameEn: 'Mie', nameJa: '三重県', x: 49, y: 62, region: 'kansai' },
  { id: 'kyoto', nameEn: 'Kyoto', nameJa: '京都府', x: 45, y: 56, region: 'kansai' },
  { id: 'osaka', nameEn: 'Osaka', nameJa: '大阪府', x: 44, y: 59, region: 'kansai' },
  { id: 'hyogo', nameEn: 'Hyogo', nameJa: '兵庫県', x: 40, y: 56, region: 'kansai' },
  { id: 'nara', nameEn: 'Nara', nameJa: '奈良県', x: 45, y: 61, region: 'kansai' },
  { id: 'wakayama', nameEn: 'Wakayama', nameJa: '和歌山県', x: 44, y: 65, region: 'kansai' },
  // Chugoku
  { id: 'tottori', nameEn: 'Tottori', nameJa: '鳥取県', x: 35, y: 54, region: 'chugoku' },
  { id: 'shimane', nameEn: 'Shimane', nameJa: '島根県', x: 29, y: 55, region: 'chugoku' },
  { id: 'okayama', nameEn: 'Okayama', nameJa: '岡山県', x: 34, y: 57, region: 'chugoku' },
  { id: 'hiroshima', nameEn: 'Hiroshima', nameJa: '広島県', x: 29, y: 58, region: 'chugoku' },
  { id: 'yamaguchi', nameEn: 'Yamaguchi', nameJa: '山口県', x: 22, y: 60, region: 'chugoku' },
  // Shikoku
  { id: 'kagawa', nameEn: 'Kagawa', nameJa: '香川県', x: 34, y: 62, region: 'shikoku' },
  { id: 'tokushima', nameEn: 'Tokushima', nameJa: '徳島県', x: 36, y: 65, region: 'shikoku' },
  { id: 'ehime', nameEn: 'Ehime', nameJa: '愛媛県', x: 28, y: 65, region: 'shikoku' },
  { id: 'kochi', nameEn: 'Kochi', nameJa: '高知県', x: 30, y: 68, region: 'shikoku' },
  // Kyushu & Okinawa
  { id: 'fukuoka', nameEn: 'Fukuoka', nameJa: '福岡県', x: 17, y: 64, region: 'kyushu' },
  { id: 'saga', nameEn: 'Saga', nameJa: '佐賀県', x: 13, y: 66, region: 'kyushu' },
  { id: 'nagasaki', nameEn: 'Nagasaki', nameJa: '長崎県', x: 11, y: 69, region: 'kyushu' },
  { id: 'kumamoto', nameEn: 'Kumamoto', nameJa: '熊本県', x: 14, y: 70, region: 'kyushu' },
  { id: 'oita', nameEn: 'Oita', nameJa: '大分県', x: 19, y: 68, region: 'kyushu' },
  { id: 'miySettings', nameEn: 'Miyazaki', nameJa: '宮崎県', x: 17, y: 75, region: 'kyushu' },
  { id: 'kagoshima', nameEn: 'Kagoshima', nameJa: '鹿児島県', x: 13, y: 78, region: 'kyushu' },
  { id: 'okinawa', nameEn: 'Okinawa', nameJa: '沖縄県', x: 13, y: 91, region: 'kyushu', isOkinawa: true }
];

// Geographical links forming the map constellation lines
const MAP_CONNECTIONS = [
  { from: 'hokkaido', to: 'aomori', isDotted: true },
  { from: 'aomori', to: 'akita' },
  { from: 'aomori', to: 'iwate' },
  { from: 'akita', to: 'iwate' },
  { from: 'akita', to: 'yamagata' },
  { from: 'iwate', to: 'miyagi' },
  { from: 'miyagi', to: 'yamagata' },
  { from: 'miyagi', to: 'fukushima' },
  { from: 'yamagata', to: 'fukushima' },
  { from: 'fukushima', to: 'niigata' },
  { from: 'fukushima', to: 'tochigi' },
  { from: 'fukushima', to: 'ibaraki' },
  { from: 'tochigi', to: 'gunma' },
  { from: 'tochigi', to: 'saitama' },
  { from: 'tochigi', to: 'ibaraki' },
  { from: 'gunma', to: 'niigata' },
  { from: 'gunma', to: 'nagano' },
  { from: 'gunma', to: 'saitama' },
  { from: 'ibaraki', to: 'chiba' },
  { from: 'ibaraki', to: 'saitama' },
  { from: 'saitama', to: 'tokyo' },
  { from: 'saitama', to: 'yamanashi' },
  { from: 'chiba', to: 'tokyo' },
  { from: 'tokyo', to: 'kanagawa' },
  { from: 'tokyo', to: 'yamanashi' },
  { from: 'kanagawa', to: 'yamanashi' },
  { from: 'kanagawa', to: 'shizuoka' },
  { from: 'yamanashi', to: 'nagano' },
  { from: 'yamanashi', to: 'shizuoka' },
  { from: 'nagano', to: 'niigata' },
  { from: 'nagano', to: 'toyama' },
  { from: 'nagano', to: 'gifu' },
  { from: 'nagano', to: 'aichi' },
  { from: 'nagano', to: 'shizuoka' },
  { from: 'niigata', to: 'toyama' },
  { from: 'toyama', to: 'ishikawa' },
  { from: 'toyama', to: 'gifu' },
  { from: 'ishikawa', to: 'fukui' },
  { from: 'fukui', to: 'gifu' },
  { from: 'fukui', to: 'shiga' },
  { from: 'fukui', to: 'kyoto' },
  { from: 'gifu', to: 'shiga' },
  { from: 'gifu', to: 'aichi' },
  { from: 'shizuoka', to: 'aichi' },
  { from: 'aichi', to: 'mie' },
  { from: 'aichi', to: 'shiga' },
  { from: 'shiga', to: 'kyoto' },
  { from: 'shiga', to: 'mie' },
  { from: 'kyoto', to: 'hyogo' },
  { from: 'kyoto', to: 'osaka' },
  { from: 'kyoto', to: 'nara' },
  { from: 'osaka', to: 'hyogo' },
  { from: 'osaka', to: 'nara' },
  { from: 'osaka', to: 'wakayama' },
  { from: 'nara', to: 'mie' },
  { from: 'nara', to: 'wakayama' },
  { from: 'mie', to: 'wakayama' },
  { from: 'hyogo', to: 'tottori' },
  { from: 'hyogo', to: 'okayama' },
  { from: 'tottori', to: 'shimane' },
  { from: 'tottori', to: 'okayama' },
  { from: 'shimane', to: 'hiroshima' },
  { from: 'okayama', to: 'hiroshima' },
  { from: 'okayama', to: 'kagawa' },
  { from: 'hiroshima', to: 'yamaguchi' },
  { from: 'hiroshima', to: 'ehime' },
  { from: 'yamaguchi', to: 'fukuoka' },
  { from: 'kagawa', to: 'tokushima' },
  { from: 'kagawa', to: 'ehime' },
  { from: 'tokushima', to: 'kochi' },
  { from: 'ehime', to: 'kochi' },
  { from: 'ehime', to: 'oita' },
  { from: 'fukuoka', to: 'saga' },
  { from: 'fukuoka', to: 'kumamoto' },
  { from: 'fukuoka', to: 'oita' },
  { from: 'saga', to: 'nagasaki' },
  { from: 'saga', to: 'kumamoto' },
  { from: 'nagasaki', to: 'kumamoto' },
  { from: 'kumamoto', to: 'oita' },
  { from: 'kumamoto', to: 'miySettings' },
  { from: 'kumamoto', to: 'kagoshima' },
  { from: 'oita', to: 'miySettings' },
  { from: 'miySettings', to: 'kagoshima' },
  { from: 'kagoshima', to: 'okinawa', isDotted: true } // Constellation jump
];

const JapanTravelMap = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [hoveredNode, setHoveredNode] = useState(null);

  const isJa = i18n.language.startsWith('ja');

  // Memoize coordinates lookup for fast rendering
  const coordsLookup = useMemo(() => {
    const map = {};
    PREFECTURES_DATA.forEach(pref => {
      map[pref.id] = { x: pref.x, y: pref.y };
    });
    return map;
  }, []);

  const handleNodeClick = (node) => {
    if (!node.isVisited) return;
    // If it has posts, navigate to the first post. If multiple, let hover handle selections.
    if (node.posts && node.posts.length === 1) {
      navigate(`/photography/${node.posts[0].slug}`);
    } else if (node.posts && node.posts.length > 1) {
      // Hover overlay has specific links. Click acts as explore trigger.
    }
  };

  return (
    <div className="japan-map-card">
      <div className="map-header">
        <Compass className="map-icon" size={24} />
        <div>
          <h2 className="map-title">{t('photography.mapTitle')}</h2>
          <p className="map-subtitle">{t('photography.mapSubtitle')}</p>
        </div>
      </div>

      <div className="map-body-wrapper">
        <div className="japan-svg-container">
          <svg
            viewBox="0 0 100 100"
            className="japan-constellation-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background grids for futuristic terminal look */}
            <defs>
              <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />

            {/* Okinawa Inset Box boundary */}
            <rect
              x="3"
              y="82"
              width="20"
              height="15"
              fill="rgba(10, 10, 11, 0.4)"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="0.3"
              strokeDasharray="2, 2"
              rx="2"
            />
            <text x="5" y="85.5" fill="rgba(255, 255, 255, 0.3)" fontSize="2" fontFamily="monospace">
              OKINAWA INSET
            </text>

            {/* Constellation Connection Lines */}
            {MAP_CONNECTIONS.map((conn, idx) => {
              const start = coordsLookup[conn.from];
              const end = coordsLookup[conn.to];
              if (!start || !end) return null;

              // Check if both nodes are visited to highlight the link
              const prefStart = PREFECTURES_DATA.find(p => p.id === conn.from);
              const prefEnd = PREFECTURES_DATA.find(p => p.id === conn.to);
              const isLinkActive = prefStart?.isVisited && prefEnd?.isVisited;

              return (
                <line
                  key={`link-${idx}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  className={`constellation-line ${conn.isDotted ? 'dotted' : ''} ${isLinkActive ? 'active-link' : ''}`}
                />
              );
            })}

            {/* Constellation Star Nodes */}
            {PREFECTURES_DATA.map((pref) => {
              const starRadius = pref.isVisited ? 1.6 : 0.8;
              return (
                <g
                  key={pref.id}
                  className={`map-node ${pref.isVisited ? 'visited' : ''} ${hoveredNode?.id === pref.id ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredNode(pref)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleNodeClick(pref)}
                >
                  {/* Glowing halo indicator for visited stars */}
                  {pref.isVisited && (
                    <circle
                      cx={pref.x}
                      cy={pref.y}
                      r="3.5"
                      className="star-glow-halo"
                    />
                  )}

                  {/* Core Star Circle */}
                  <circle
                    cx={pref.x}
                    cy={pref.y}
                    r={starRadius}
                    className="star-core"
                  />
                </g>
              );
            })}
          </svg>

          {/* Floating Glassmorphic Polaroid Hover Preview Card */}
          {hoveredNode && (
            <div
              className={`map-hover-card ${hoveredNode.y > 60 ? 'near-bottom' : 'near-top'} ${hoveredNode.x > 60 ? 'align-right' : hoveredNode.x < 30 ? 'align-left' : 'align-center'}`}
              style={{
                left: `${hoveredNode.x}%`,
                top: `${hoveredNode.y}%`,
              }}
            >
              <div className="hover-card-inner">
                {/* Visual Label */}
                <div className="hover-card-tag-row">
                  <span className={`hover-card-tag ${hoveredNode.isVisited ? 'visited-tag' : 'unvisited-tag'}`}>
                    {hoveredNode.isVisited ? t('photography.visitedLabel') : t('photography.unvisitedLabel')}
                  </span>
                  {hoveredNode.date && (
                    <span className="hover-card-date">
                      <Calendar size={10} style={{ marginRight: '3px' }} />
                      {hoveredNode.date}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="hover-card-title">
                  {isJa ? hoveredNode.nameJa : hoveredNode.nameEn}
                  {isJa && hoveredNode.nameEn && <span className="title-sub"> ({hoveredNode.nameEn})</span>}
                  {!isJa && hoveredNode.nameJa && <span className="title-sub"> ({hoveredNode.nameJa})</span>}
                </h3>

                {/* Visited Content Details */}
                {hoveredNode.isVisited ? (
                  <div className="visited-card-content">
                    {hoveredNode.image && (
                      <div className="hover-card-image-wrapper">
                        <img
                          src={hoveredNode.image}
                          alt={hoveredNode.nameEn}
                          className="hover-card-img"
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                          style={{ userSelect: 'none', WebkitUserDrag: 'none' }}
                        />
                        <div className="image-protection-shield" />
                      </div>
                    )}
                    <p className="hover-card-desc">{hoveredNode.details}</p>

                    {/* Links to posts */}
                    {hoveredNode.posts && hoveredNode.posts.length > 0 && (
                      <div className="hover-card-links">
                        <span className="links-header-label">{t('photography.detailsLabel')}:</span>
                        {hoveredNode.posts.map((post, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/photography/${post.slug}`);
                            }}
                            className="hover-card-btn"
                          >
                            <span>{post.title}</span>
                            <ArrowRight size={12} className="btn-arrow" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="hover-card-desc-unvisited">
                    {isJa ? 'まだ旅行記はありません。' : 'No photo logs documented yet for this prefecture.'}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JapanTravelMap;
