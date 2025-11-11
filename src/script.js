
// Writeup 設定檔（index.json 格式）
let writeups = [];
let loadError = null;

document.getElementById('search').addEventListener('input', (e) => {
    filterWriteups();
});

// 載入 writeup 索引
async function loadWriteupIndex() {
    try {
        // 載入 writeups
        const writeupResponse = await fetch('data/writeups.json');
        let writeupData = [];
        if (writeupResponse.ok) {
            writeupData = await writeupResponse.json();
        } else {
            console.warn('無法載入 writeups.json');
        }

        // 載入 knowledge
        const knowledgeResponse = await fetch('data/knowleges.json');
        let knowledgeData = [];
        if (knowledgeResponse.ok) {
            knowledgeData = await knowledgeResponse.json();
        } else {
            console.warn('無法載入 knowledge.json');
        }

        // 合併資料
        const allData = [...writeupData, ...knowledgeData];

        if (allData.length === 0) {
            throw new Error('沒有成功載入任何資料');
        }

        // 載入每個項目的內容
        const promises = allData.map(async (item) => {
            try {
                const contentResponse = await fetch(`./writeups/${item.folder}/README.md`);
                if (!contentResponse.ok) {
                    console.warn(`無法載入 ${item.folder}`);
                    return null;
                }
                const content = await contentResponse.text();
                return { ...item, content };
            } catch (err) {
                console.warn(`載入 ${item.folder} 時發生錯誤:`, err);
                return null;
            }
        });

        writeups = (await Promise.all(promises)).filter(w => w !== null);

        if (writeups.length === 0) {
            throw new Error('沒有成功載入任何內容');
        }

        return true;
    } catch (err) {
        console.error('載入錯誤:', err);
        loadError = err.message;
        // 使用範例資料
        loadExampleData();
        return false;
    }
}

// 初始化
let activeFilters = {
    os: [],
    software: [],
    vulns: [],
    tools: []
};

let showAllTags = {
    os: false,
    software: false,
    vulns: false,
    tools: false
};

const TAG_DISPLAY_LIMIT = 5;

// 收集所有唯一的標籤（可以基於篩選後的結果）
function collectTags(filteredWriteups = null) {
    const tags = {
        os: new Set(),
        software: new Set(),
        vulns: new Set(),
        tools: new Set()
    };
    const writeupsToUse = filteredWriteups || writeups;

    writeupsToUse.forEach(w => {
        if (w.os) w.os.forEach(t => tags.os.add(t));
        if (w.software) w.software.forEach(t => tags.software.add(t));
        if (w.vulns) w.vulns.forEach(t => tags.vulns.add(t));
        if (w.tools) w.tools.forEach(t => tags.tools.add(t));
    });
    return tags;
}

// 渲染標籤
function renderTags(searchTerm = '', filteredWriteups = null) {
    const tags = collectTags(filteredWriteups);

    const toolContainer = document.getElementById('tool-tags');

    toolContainer.innerHTML = '';
    renderTagGroup(Array.from(tags.tools), toolContainer, 'tool', searchTerm, filteredWriteups);
}

// 渲染標籤組
function renderTagGroup(tagArray, container, type, searchTerm, filteredWriteups = null) {
    let filteredTags = tagArray;
    if (searchTerm) {
        filteredTags = tagArray.filter(tag =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // 計算每個標籤的文章數量
    const writeupsToCount = filteredWriteups || writeups;
    const typeKey = type === 'vuln' ? 'vulns' : type === 'tool' ? 'tools' : type;

    const tagCounts = {};
    filteredTags.forEach(tag => {
        tagCounts[tag] = writeupsToCount.filter(w =>
            w[typeKey] && w[typeKey].includes(tag)
        ).length;
    });

    // 過濾掉數量為 0 的標籤
    if (filteredWriteups) {
        filteredTags = filteredTags.filter(tag => tagCounts[tag] > 0);
    }

    const showAll = showAllTags[typeKey];
    const tagsToShow = showAll ? filteredTags : filteredTags.slice(0, TAG_DISPLAY_LIMIT);

    tagsToShow.forEach(tag => {
        const el = document.createElement('div');
        el.className = `tag ${type}`;

        // 顯示標籤名稱和數量
        const count = tagCounts[tag] || 0;
        el.textContent = `${tag} (${count})`;
        el.onclick = () => toggleFilter(typeKey, tag);

        if (activeFilters[typeKey].includes(tag)) {
            el.classList.add('active');
        }

        container.appendChild(el);
    });

    if (!showAll && filteredTags.length > TAG_DISPLAY_LIMIT) {
        const moreBtn = document.createElement('div');
        moreBtn.className = 'tag ' + type;
        moreBtn.style.cssText = 'cursor: pointer; font-weight: bold; border-style: dashed;';
        moreBtn.textContent = `+${filteredTags.length - TAG_DISPLAY_LIMIT} 更多`;
        moreBtn.onclick = () => toggleShowAll(typeKey);
        container.appendChild(moreBtn);
    } else if (showAll && filteredTags.length > TAG_DISPLAY_LIMIT) {
        const lessBtn = document.createElement('div');
        lessBtn.className = 'tag ' + type;
        lessBtn.style.cssText = 'cursor: pointer; font-weight: bold; border-style: dashed;';
        lessBtn.textContent = '顯示較少';
        lessBtn.onclick = () => toggleShowAll(typeKey);
        container.appendChild(lessBtn);
    }

    if (searchTerm && filteredTags.length === 0) {
        const noResult = document.createElement('div');
        noResult.style.cssText = 'color: #999; font-size: 12px; padding: 5px;';
        noResult.textContent = '無符合的標籤';
        container.appendChild(noResult);
    }
}

// 切換顯示全部/部分標籤
function toggleShowAll(type) {
    showAllTags[type] = !showAllTags[type];
    filterWriteups();
}

// 切換篩選
function toggleFilter(type, tag) {
    const index = activeFilters[type].indexOf(tag);
    if (index > -1) {
        activeFilters[type].splice(index, 1);
    } else {
        activeFilters[type].push(tag);
    }
    filterWriteups();
}

// 篩選 writeups
function filterWriteups() {
    const searchTerm = document.getElementById('search').value.toLowerCase();

    const filtered = writeups.filter(w => {
        const matchesSearch = searchTerm === '' ||
            w.title.toLowerCase().includes(searchTerm) ||
            w.description.toLowerCase().includes(searchTerm) ||
            (w.os && w.os.some(tag => tag.toLowerCase().includes(searchTerm))) ||
            (w.software && w.software.some(tag => tag.toLowerCase().includes(searchTerm))) ||
            (w.vulns && w.vulns.some(tag => tag.toLowerCase().includes(searchTerm))) ||
            (w.tools && w.tools.some(tag => tag.toLowerCase().includes(searchTerm)));


        const matchesOs = activeFilters.os.length === 0 ||
            (w.os && activeFilters.os.some(tag => w.os.includes(tag)));
        const matchesSoftware = activeFilters.software.length === 0 ||
            (w.software && activeFilters.software.some(tag => w.software.includes(tag)));
        const matchesVulns = activeFilters.vulns.length === 0 ||
            (w.vulns && activeFilters.vulns.some(tag => w.vulns.includes(tag)));
        const matchesTools = activeFilters.tools.length === 0 ||
            (w.tools && activeFilters.tools.some(tag => w.tools.includes(tag)));

        return matchesSearch && matchesOs && matchesSoftware && matchesVulns && matchesTools;
    });

    // 更新標籤顯示（基於篩選後的結果）
    renderTags(searchTerm, filtered);
    // 渲染文章卡片
    renderWriteups(filtered);
}

// 渲染 writeup 卡片
function renderWriteups(writeupsToRender) {
    const container = document.getElementById('writeups-container');
    container.innerHTML = '';

    writeupsToRender.forEach((w, index) => {
        const card = document.createElement('div');
        card.className = 'writeup-card';

        // 如果是知識庫類型，添加特殊樣式
        if (w.type === 'knowledge') {
            card.classList.add('knowledge-card');
        }

        card.onclick = () => openModal(w);

        const platformHtml = w.platform ? `<div class="platform ${w.platform}">${w.platform.toUpperCase()}</div>` : '';


        // 假設你的 GitHub repo 是 public，路徑如下（請改成你自己的）
        const githubBaseUrl = 'https://github.com/numb2too/writeups/blob/main/writeups';

        // 組成對應的 .md 檔案連結
        const githubUrl = `${githubBaseUrl}/${w.folder}/README.md`;

        card.innerHTML = `
                    <div class="writeup-header">
                        <div>
                            <div class="writeup-title">${w.title}</div>
                            <span style="color: #999; font-size: 12px; margin-top: 5px;">📅 ${w.date}</span>
                             <a href="${githubUrl}" 
               target="_blank" 
                onclick="event.stopPropagation();" 
              style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: #f5f5f5; transition: 0.2s;">
                <svg height="18" viewBox="0 0 16 16" width="18" fill="#333" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0C3.58 0 0 3.58 0 8a8.013 8.013 0 005.47 7.59c.4.075.55-.175.55-.388 
                    0-.19-.007-.693-.01-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.727-.497.055-.487.055-.487.803.056 
                    1.225.825 1.225.825.714 1.223 1.872.87 2.327.665.072-.517.28-.87.508-1.07-1.777-.2-3.644-.888-3.644-3.955 
                    0-.873.312-1.587.824-2.147-.083-.203-.357-1.018.078-2.12 0 0 .67-.215 2.2.82A7.548 
                    7.548 0 018 4.875a7.55 7.55 0 011.996.27c1.53-1.035 2.198-.82 2.198-.82.437 1.102.163 1.917.08 
                    2.12.513.56.823 1.274.823 2.147 0 3.073-1.87 3.752-3.65 3.947.288.248.543.736.543 
                    1.482 0 1.07-.01 1.934-.01 2.197 0 .215.147.466.552.387A8.013 8.013 0 0016 
                    8c0-4.42-3.58-8-8-8z"/>
                </svg>
            </a>
                        </div>
                        ${platformHtml}
                    </div>
                    <div class="writeup-desc">${w.description}</div>
                    <div class="writeup-tags">
                        ${w.os ? w.os.map(t => `<div class="tag os">${t}</div>`).join('') : ''}
                        ${w.software ? w.software.map(t => `<div class="tag software">${t}</div>`).join('') : ''}
                        ${w.vulns ? w.vulns.map(t => `<div class="tag vuln">${t}</div>`).join('') : ''}
                        ${w.tools ? w.tools.map(t => `<div class="tag tool">${t}</div>`).join('') : ''}
                        ${w.type === 'knowledge' ? '<div class="tag knowledge">知識庫</div>' : ''}
                    </div>
                `;

        container.appendChild(card);
    });

    document.getElementById('total-count').textContent = writeupsToRender.length;
}

// 開啟 Modal
function openModal(writeup) {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modal-body');

    // 產生 Markdown HTML + GitHub 連結
    body.innerHTML = `
        ${marked.parse(writeup.content)}
    `;

    modal.classList.add('active');
}

// 關閉 Modal
function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// 點擊背景關閉 Modal
document.getElementById('modal').onclick = function (e) {
    if (e.target === this) {
        closeModal();
    }
};

// 搜尋事件
document.getElementById('search').addEventListener('input', (e) => {
    // 清空已選的篩選
    activeFilters = {
        os: [],
        software: [],
        vulns: [],
        tools: []
    };
    const searchTerm = e.target.value;
    renderTags(searchTerm);
    filterWriteups();
});

// 初始化頁面
async function init() {
    const loaded = await loadWriteupIndex();

    if (!loaded && loadError) {
        // 顯示警告訊息
        const header = document.querySelector('header');
        const warning = document.createElement('div');
        warning.style.cssText = 'background: #fff3cd; border: 2px solid #ffc107; padding: 15px; border-radius: 8px; margin-top: 15px;';
        warning.innerHTML = `
                    <strong>⚠️ 開發模式</strong><br>
                    <span style="color: #856404;">無法載入 writeups.json 或 knowledge.json，使用範例資料。</span><br>
                    <small style="color: #666;">提示：請建立 writeups 資料夾並加入 writeups.json 和 knowledge.json 檔案</small>
                `;
        header.appendChild(warning);
    }

    renderTags();
    renderWriteups(writeups);
}

init();
