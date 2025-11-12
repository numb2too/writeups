// ========== 全域變數 ==========
let writeups = []; // 完整索引資料（不含內容）
let loadedContents = {}; // 已載入的內容快取
let loadError = null;
let activeFilters = { tools: [] };
let showAllTags = { tools: false };
let currentPage = 1;
let filteredWriteups = [];

const TAG_DISPLAY_LIMIT = 9;
const CARDS_PER_PAGE = 6;

// ========== 事件監聽 ==========
document.getElementById('search').addEventListener('input', filterWriteups);
document.getElementById('tag-search').addEventListener('input', (e) => {
    renderTags(e.target.value);
});
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
});

// ========== 資料載入 ==========
async function loadWriteupIndex() {
    try {
        const [writeupRes, knowledgeRes] = await Promise.all([
            fetch('data/writeups.json').catch(() => ({ ok: false })),
            fetch('data/knowleges.json').catch(() => ({ ok: false }))
        ]);

        const writeupData = writeupRes.ok ? await writeupRes.json() : [];
        const knowledgeData = knowledgeRes.ok ? await knowledgeRes.json() : [];

        writeups = [...writeupData, ...knowledgeData];

        if (writeups.length === 0) {
            throw new Error('沒有成功載入任何資料');
        }

        // 按日期排序（新到舊）
        writeups.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA; // 降序排列
        });

        console.log(`✅ 成功載入 ${writeups.length} 筆索引（已按日期排序）`);
        return true;
    } catch (err) {
        console.error('載入錯誤:', err);
        loadError = err.message;
        return false;
    }
}

async function loadContent(folder) {
    if (loadedContents[folder]) {
        return loadedContents[folder];
    }

    try {
        const response = await fetch(`./writeups/${folder}/README.md`);
        if (!response.ok) throw new Error(`無法載入 ${folder}`);

        const content = await response.text();
        loadedContents[folder] = content;
        return content;
    } catch (err) {
        console.warn(`載入 ${folder} 時發生錯誤:`, err);
        return '# 載入失敗\n\n無法載入此文章內容。';
    }
}

// ========== 標籤處理 ==========
function collectTags() {
    const tools = new Set();
    filteredWriteups.forEach(w => {
        if (w.tools) w.tools.forEach(t => tools.add(t));
    });
    return { tools: Array.from(tools) };
}

function renderTags(tagSearchTerm = '') {
    const tags = collectTags();
    const toolContainer = document.getElementById('tool-tags');
    toolContainer.innerHTML = '';
    renderTagGroup(tags.tools, toolContainer, 'tools', tagSearchTerm);
}

function renderTagGroup(tagArray, container, type, tagSearchTerm) {
    // 過濾標籤
    let filteredTags = tagSearchTerm
        ? tagArray.filter(tag => tag.toLowerCase().includes(tagSearchTerm.toLowerCase()))
        : tagArray;

    // 計算每個標籤的數量
    const tagCounts = {};
    filteredTags.forEach(tag => {
        tagCounts[tag] = filteredWriteups.filter(w =>
            w[type] && w[type].includes(tag)
        ).length;
    });

    // 移除數量為 0 的標籤
    filteredTags = filteredTags.filter(tag => tagCounts[tag] > 0);

    // 決定顯示數量
    const showAll = showAllTags[type];
    const tagsToShow = showAll ? filteredTags : filteredTags.slice(0, TAG_DISPLAY_LIMIT);

    // 渲染標籤
    tagsToShow.forEach(tag => {
        const el = document.createElement('div');
        el.className = 'tag tool';
        el.textContent = `${tag} (${tagCounts[tag]})`;
        el.onclick = () => toggleFilter(type, tag);
        container.appendChild(el);
    });

    // 顯示更多/較少按鈕
    if (!showAll && filteredTags.length > TAG_DISPLAY_LIMIT) {
        const moreBtn = createToggleButton(
            `+${filteredTags.length - TAG_DISPLAY_LIMIT} 更多`,
            () => toggleShowAll(type)
        );
        container.appendChild(moreBtn);
    } else if (showAll && filteredTags.length > TAG_DISPLAY_LIMIT) {
        const lessBtn = createToggleButton('顯示較少', () => toggleShowAll(type));
        container.appendChild(lessBtn);
    }

    // 無結果提示
    if (tagSearchTerm && filteredTags.length === 0) {
        const noResult = document.createElement('div');
        noResult.className = 'no-result';
        noResult.textContent = '無符合的標籤';
        container.appendChild(noResult);
    }
}

function createToggleButton(text, onClick) {
    const btn = document.createElement('div');
    btn.className = 'tag tool toggle-btn';
    btn.textContent = text;
    btn.onclick = onClick;
    return btn;
}

function toggleShowAll(type) {
    showAllTags[type] = !showAllTags[type];
    const tagSearchTerm = document.getElementById('tag-search').value;
    renderTags(tagSearchTerm);
}

function toggleFilter(type, tag) {
    const index = activeFilters[type].indexOf(tag);
    if (index > -1) {
        activeFilters[type].splice(index, 1);
    } else {
        activeFilters[type].push(tag);
    }
    renderSelectedTags();
    filterWriteups();
}

function renderSelectedTags() {
    const container = document.getElementById('selected-tags-container');
    const section = document.getElementById('selected-tags-section');

    container.innerHTML = '';

    if (activeFilters.tools.length === 0) {
        section.classList.remove('active');
        return;
    }

    section.classList.add('active');

    activeFilters.tools.forEach(tag => {
        const el = document.createElement('div');
        el.className = 'tag tool selected';
        el.textContent = tag;
        el.onclick = () => toggleFilter('tools', tag);
        container.appendChild(el);
    });
}

function clearAllFilters() {
    activeFilters = { tools: [] };
    renderSelectedTags();
    filterWriteups();
}

// ========== 篩選與渲染 ==========
function filterWriteups() {
    const searchTerm = document.getElementById('search').value.toLowerCase();

    filteredWriteups = writeups.filter(w => {
        const matchesSearch = searchTerm === '' ||
            w.title.toLowerCase().includes(searchTerm) ||
            w.description.toLowerCase().includes(searchTerm) ||
            (w.platform && w.platform.toLowerCase().includes(searchTerm));

        const matchesTools = activeFilters.tools.length === 0 ||
            (w.tools && activeFilters.tools.every(tag => w.tools.includes(tag)));

        return matchesSearch && matchesTools;
    });

    currentPage = 1;
    renderTags(); // 重新渲染標籤以更新數量
    renderWriteups();
}

function renderWriteups() {
    const container = document.getElementById('writeups-container');
    const endIndex = currentPage * CARDS_PER_PAGE;
    const writeupsToRender = filteredWriteups.slice(0, endIndex);
    const hasMore = endIndex < filteredWriteups.length;

    container.innerHTML = '';

    writeupsToRender.forEach(w => {
        container.appendChild(createWriteupCard(w));
    });

    if (hasMore) {
        container.appendChild(createLoadMoreButton(filteredWriteups.length - endIndex));
    }

    updateCount(writeupsToRender.length, filteredWriteups.length);
}

function createWriteupCard(w) {
    const card = document.createElement('div');
    card.className = 'writeup-card';
    if (w.platform === 'knowledge') {
        card.classList.add('knowledge-card');
    }
    card.onclick = () => openModal(w);

    const platformHtml = w.platform
        ? `<div class="platform ${w.platform}">${w.platform.toUpperCase()}</div>`
        : '';

    const githubUrl = `https://github.com/numb2too/writeups/blob/main/writeups/${w.folder}/README.md`;

    card.innerHTML = `
        <div class="writeup-header">
            <div>
                <div class="writeup-title">${w.title}</div>
                <span class="writeup-date">📅 ${w.date}</span>
                <a href="${githubUrl}" target="_blank" onclick="event.stopPropagation();" class="github-link">
                    <svg height="18" viewBox="0 0 16 16" width="18" fill="#333">
                        <path d="M8 0C3.58 0 0 3.58 0 8a8.013 8.013 0 005.47 7.59c.4.075.55-.175.55-.388 0-.19-.007-.693-.01-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.727-.497.055-.487.055-.487.803.056 1.225.825 1.225.825.714 1.223 1.872.87 2.327.665.072-.517.28-.87.508-1.07-1.777-.2-3.644-.888-3.644-3.955 0-.873.312-1.587.824-2.147-.083-.203-.357-1.018.078-2.12 0 0 .67-.215 2.2.82A7.548 7.548 0 018 4.875a7.55 7.55 0 011.996.27c1.53-1.035 2.198-.82 2.198-.82.437 1.102.163 1.917.08 2.12.513.56.823 1.274.823 2.147 0 3.073-1.87 3.752-3.65 3.947.288.248.543.736.543 1.482 0 1.07-.01 1.934-.01 2.197 0 .215.147.466.552.387A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                </a>
            </div>
            ${platformHtml}
        </div>
        <div class="writeup-desc">${w.description}</div>
        <div class="writeup-tags" onclick="event.stopPropagation();">
            ${w.tools ? w.tools.map(t =>
        `<div class="tag tool" data-tag="${t}">${t}</div>`
    ).join('') : ''}
        </div>
    `;

    // 標籤點擊事件
    card.querySelectorAll('.writeup-tags .tag').forEach(tagEl => {
        tagEl.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFilter('tools', tagEl.dataset.tag);
        });
    });

    return card;
}

function createLoadMoreButton(remaining) {
    const wrapper = document.createElement('div');
    wrapper.className = 'load-more-wrapper';

    const btn = document.createElement('button');
    btn.id = 'load-more-btn';
    btn.className = 'load-more-btn';
    btn.textContent = `載入更多 (剩餘 ${remaining} 筆)`;
    btn.onclick = () => {
        currentPage++;
        renderWriteups();
    };

    wrapper.appendChild(btn);
    return wrapper;
}

function updateCount(shown, total) {
    document.getElementById('total-count').textContent = `顯示 ${shown} / ${total}`;
}

// ========== Modal 處理 ==========
async function openModal(writeup) {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modal-body');
    const github = document.getElementById('modal-github');

    github.href = `https://github.com/numb2too/writeups/blob/main/writeups/${writeup.folder}/README.md`;

    body.innerHTML = '<div class="loading-spinner"><div>⏳</div><div>載入中...</div></div>';
    modal.classList.add('active');

    const content = await loadContent(writeup.folder);
    body.innerHTML = marked.parse(content);
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// ========== 初始化 ==========
async function init() {
    const loaded = await loadWriteupIndex();

    if (!loaded && loadError) {
        showWarning();
    }

    filteredWriteups = [...writeups];
    renderTags();
    renderWriteups();
}

function showWarning() {
    const header = document.querySelector('header');
    const warning = document.createElement('div');
    warning.className = 'dev-warning';
    warning.innerHTML = `
        <strong>⚠️ 開發模式</strong><br>
        <span>無法載入 writeups.json 或 knowledge.json，使用範例資料。</span><br>
        <small>提示：請建立 writeups 資料夾並加入 writeups.json 和 knowledge.json 檔案</small>
    `;
    header.appendChild(warning);
}

init();