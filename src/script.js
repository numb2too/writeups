let writeups = [];
let loadError = null;
let activeFilters = {
    tools: []
};
let showAllTags = {
    tools: false
};

const TAG_DISPLAY_LIMIT = 5;

// 修改: 標題/描述搜尋事件
document.getElementById('search').addEventListener('input', (e) => {
    filterWriteups();
});

// 新增: 標籤搜尋事件
document.getElementById('tag-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    renderTags(searchTerm);
});

// 載入 writeup 索引
async function loadWriteupIndex() {
    try {
        const writeupResponse = await fetch('data/writeups.json');
        let writeupData = [];
        if (writeupResponse.ok) {
            writeupData = await writeupResponse.json();
        } else {
            console.warn('無法載入 writeups.json');
        }

        const knowledgeResponse = await fetch('data/knowleges.json');
        let knowledgeData = [];
        if (knowledgeResponse.ok) {
            knowledgeData = await knowledgeResponse.json();
        } else {
            console.warn('無法載入 knowledge.json');
        }

        const allData = [...writeupData, ...knowledgeData];

        if (allData.length === 0) {
            throw new Error('沒有成功載入任何資料');
        }

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
        loadExampleData();
        return false;
    }
}

function collectTags(filteredWriteups = null) {
    const tags = {
        tools: new Set()
    };
    const writeupsToUse = filteredWriteups || writeups;

    writeupsToUse.forEach(w => {
        if (w.tools) w.tools.forEach(t => tags.tools.add(t));
    });
    return tags;
}

// 修改: 渲染標籤 (接受標籤搜尋詞)
function renderTags(tagSearchTerm = '', filteredWriteups = null) {
    const tags = collectTags(filteredWriteups);
    const toolContainer = document.getElementById('tool-tags');
    toolContainer.innerHTML = '';
    renderTagGroup(Array.from(tags.tools), toolContainer, 'tool', tagSearchTerm, filteredWriteups);
}

function renderTagGroup(tagArray, container, type, tagSearchTerm, filteredWriteups = null) {
    let filteredTags = tagArray;

    // 使用標籤搜尋詞過濾
    if (tagSearchTerm) {
        filteredTags = tagArray.filter(tag =>
            tag.toLowerCase().includes(tagSearchTerm.toLowerCase())
        );
    }

    const writeupsToCount = filteredWriteups || writeups;
    const typeKey = type === 'vuln' ? 'vulns' : type === 'tool' ? 'tools' : type;

    const tagCounts = {};
    filteredTags.forEach(tag => {
        tagCounts[tag] = writeupsToCount.filter(w =>
            w[typeKey] && w[typeKey].includes(tag)
        ).length;
    });

    if (filteredWriteups) {
        filteredTags = filteredTags.filter(tag => tagCounts[tag] > 0);
    }

    const showAll = showAllTags[typeKey];
    const tagsToShow = showAll ? filteredTags : filteredTags.slice(0, TAG_DISPLAY_LIMIT);

    tagsToShow.forEach(tag => {
        const el = document.createElement('div');
        el.className = `tag ${type}`;

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

    if (tagSearchTerm && filteredTags.length === 0) {
        const noResult = document.createElement('div');
        noResult.style.cssText = 'color: #999; font-size: 12px; padding: 5px;';
        noResult.textContent = '無符合的標籤';
        container.appendChild(noResult);
    }
}

function toggleShowAll(type) {
    showAllTags[type] = !showAllTags[type];
    const tagSearchTerm = document.getElementById('tag-search').value;
    renderTags(tagSearchTerm);
}

// 修改: 切換篩選
function toggleFilter(platform, tag) {
    const index = activeFilters[platform].indexOf(tag);
    if (index > -1) {
        activeFilters[platform].splice(index, 1);
    } else {
        activeFilters[platform].push(tag);
    }
    renderSelectedTags();
    filterWriteups();
}

// 新增: 渲染已選擇的標籤
function renderSelectedTags() {
    const container = document.getElementById('selected-tags-container');
    const section = document.getElementById('selected-tags-section');

    container.innerHTML = '';

    const allSelected = [...activeFilters.tools];

    if (allSelected.length === 0) {
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

// 新增: 清除所有篩選
function clearAllFilters() {
    activeFilters = {
        tools: []
    };
    renderSelectedTags();
    filterWriteups();
}

// 修改: 篩選 writeups (只搜尋標題和描述)
function filterWriteups() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const tagSearchTerm = document.getElementById('tag-search').value.toLowerCase();

    const filtered = writeups.filter(w => {
        // 只搜尋標題和描述
        const matchesSearch = searchTerm === '' ||
            w.title.toLowerCase().includes(searchTerm) ||
            w.description.toLowerCase().includes(searchTerm) ||
            w.platform.toLowerCase().includes(searchTerm);

        const matchesTools = activeFilters.tools.length === 0 ||
            (w.tools && activeFilters.tools.every(tag => w.tools.includes(tag)));

        return matchesSearch && matchesTools;
    });

    renderWriteups(filtered);
}

function renderWriteups(writeupsToRender) {
    const container = document.getElementById('writeups-container');
    container.innerHTML = '';

    writeupsToRender.forEach((w, index) => {
        const card = document.createElement('div');
        card.className = 'writeup-card';

        if (w.platform === 'knowledge') {
            card.classList.add('knowledge-card');
        }

        card.onclick = () => openModal(w);

        const platformHtml = w.platform ? `<div class="platform ${w.platform}">${w.platform.toUpperCase()}</div>` : '';
        const githubBaseUrl = 'https://github.com/numb2too/writeups/blob/main/writeups';
        const githubUrl = `${githubBaseUrl}/${w.folder}/README.md`;

        card.innerHTML = `
            <div class="writeup-header">
                <div>
                    <div class="writeup-title">${w.title}</div>
                    <span style="color: #999; font-size: 12px; margin-top: 5px;">📅 ${w.date}</span>
                    <a href="${githubUrl}" target="_blank" onclick="event.stopPropagation();" 
                       style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: #f5f5f5; transition: 0.2s;">
                        <svg height="18" viewBox="0 0 16 16" width="18" fill="#333" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 0C3.58 0 0 3.58 0 8a8.013 8.013 0 005.47 7.59c.4.075.55-.175.55-.388 0-.19-.007-.693-.01-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.727-.497.055-.487.055-.487.803.056 1.225.825 1.225.825.714 1.223 1.872.87 2.327.665.072-.517.28-.87.508-1.07-1.777-.2-3.644-.888-3.644-3.955 0-.873.312-1.587.824-2.147-.083-.203-.357-1.018.078-2.12 0 0 .67-.215 2.2.82A7.548 7.548 0 018 4.875a7.55 7.55 0 011.996.27c1.53-1.035 2.198-.82 2.198-.82.437 1.102.163 1.917.08 2.12.513.56.823 1.274.823 2.147 0 3.073-1.87 3.752-3.65 3.947.288.248.543.736.543 1.482 0 1.07-.01 1.934-.01 2.197 0 .215.147.466.552.387A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                    </a>
                </div>
                ${platformHtml}
            </div>
            <div class="writeup-desc">${w.description}</div>
            <div class="writeup-tags" onclick="event.stopPropagation();">
                ${w.tools ? w.tools.map(t => `<div class="tag tool" data-type="tools" data-tag="${t}">${t}</div>`).join('') : ''}
            </div>
        `;

        container.appendChild(card);

        card.querySelectorAll('.writeup-tags .tag').forEach(tagEl => {
            tagEl.addEventListener('click', (e) => {
                e.stopPropagation();
                const platform = tagEl.dataset.platform;
                const tag = tagEl.dataset.tag;

                toggleFilter(platform, tag);
            });
        });
    });

    document.getElementById('total-count').textContent = writeupsToRender.length;
}

function openModal(writeup) {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modal-body');
    body.innerHTML = `${marked.parse(writeup.content)}`;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

document.getElementById('modal').onclick = function (e) {
    if (e.target === this) {
        closeModal();
    }
};

async function init() {
    const loaded = await loadWriteupIndex();

    if (!loaded && loadError) {
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