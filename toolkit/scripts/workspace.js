/** CourseKit Toolkit workspace. Course and tool discovery remain framework services. */
const elements = {
    status: document.getElementById('toolkit-status'),
    course: document.getElementById('toolkit-course'),
    tools: document.getElementById('toolkit-tools'),
    toolCount: document.getElementById('toolkit-tools-count'),
    activeTool: document.getElementById('toolkit-active-tool'),
    activeDescription: document.getElementById('toolkit-active-description'),
    empty: document.getElementById('toolkit-empty'),
    frame: document.getElementById('toolkit-frame')
};

let context;
let selectedCourse = null;
let activeTool = null;
let tools = [];

function courseRoot(course) {
    return course?.resources?.courseRoot?.href ?? null;
}

function courseLabel(course, index) {
    const info = course?.settings?.data?.course || {};
    const name = [info.code, info.section].filter(Boolean).join(' · ');
    const title = info.title || '';
    return [name, title].filter(Boolean).join(' — ') || courseRoot(course) || `Course ${index + 1}`;
}

function selectedCourseDetail() {
    return { course: selectedCourse, courseRoot: courseRoot(selectedCourse) };
}

function announceCourse() {
    const detail = selectedCourseDetail();
    window.dispatchEvent(new CustomEvent('coursekit:course-changed', { detail }));
    // Tools from the same CourseKit origin can also read parent.CourseKitToolkitWorkspace.
    // Deliver a notification to an already-loaded tool without reloading its UI.
    try {
        if (elements.frame.contentWindow && !elements.frame.hidden) {
            elements.frame.contentWindow.dispatchEvent(
                new CustomEvent('coursekit:course-changed', { detail })
            );
        }
    } catch (error) {
        // Cross-origin tools cannot access the parent's course objects.
        console.warn('[CourseKit Toolkit] Tool frame does not share the Toolkit origin.', error);
    }
}

function renderCourses(courses) {
    elements.course.replaceChildren();
    if (!courses.length) {
        elements.course.add(new Option('No courses configured', ''));
        elements.course.disabled = true;
        return;
    }
    courses.forEach((course, index) => {
        elements.course.add(new Option(courseLabel(course, index), String(index)));
    });
    elements.course.disabled = courses.length < 2;
    selectCourse(0);
}

function selectCourse(index) {
    selectedCourse = context.courses[index] || null;
    elements.course.value = String(index);
    announceCourse();
}

function selectTool(tool) {
    if (activeTool?.id === tool.id) return;
    activeTool = tool;
    elements.activeTool.textContent = tool.name;
    elements.activeDescription.textContent = tool.description || 'CourseKit tool';
    elements.empty.hidden = true;
    elements.frame.hidden = false;
    elements.frame.title = tool.name;
    elements.frame.src = tool.entryUrl;
    elements.tools.querySelectorAll('button[data-tool-id]').forEach(button => {
        button.setAttribute('aria-current', String(button.dataset.toolId === tool.id));
    });
    elements.status.textContent = `Tool: ${tool.name}`;
}

function renderTools(items) {
    elements.tools.replaceChildren();
    elements.toolCount.textContent = String(items.length);
    if (!items.length) {
        const message = document.createElement('p');
        message.className = 'toolkit-no-tools';
        message.textContent = 'No tools configured in tools.json.';
        elements.tools.append(message);
        return;
    }

    for (const category of ['deployed', 'local']) {
        const group = items.filter(tool => tool.category === category);
        if (!group.length) continue;
        const heading = document.createElement('h3');
        heading.className = 'toolkit-group-title';
        heading.textContent = category === 'deployed' ? 'Deployed tools' : 'Local tools';
        elements.tools.append(heading);
        group.forEach(tool => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'toolkit-tool';
            button.dataset.toolId = tool.id;
            button.setAttribute('aria-current', 'false');
            const name = document.createElement('span');
            name.className = 'toolkit-tool-name';
            name.textContent = tool.name;
            button.append(name);
            if (tool.description) {
                const description = document.createElement('span');
                description.className = 'toolkit-tool-description';
                description.textContent = tool.description;
                button.append(description);
            }
            button.addEventListener('click', () => selectTool(tool));
            elements.tools.append(button);
        });
    }
}

async function main() {
    const ready = window.CourseKitToolkit || new Promise((resolve, reject) => {
        document.addEventListener('coursekit:toolkit-ready', event => resolve(event.detail), { once: true });
        document.addEventListener('coursekit:toolkit-error', event => reject(event.detail), { once: true });
    });
    context = await ready;
    // Public workspace context for same-origin tools embedded in the central iframe.
    window.CourseKitToolkitWorkspace = Object.freeze({
        get toolkit() { return context; },
        get selectedCourse() { return selectedCourse; },
        get courseRoot() { return courseRoot(selectedCourse); },
        get activeTool() { return activeTool; }
    });
    renderCourses(context.courses);
    elements.course.addEventListener('change', () => selectCourse(Number(elements.course.value)));
    elements.frame.addEventListener('load', announceCourse);
    tools = await context.loadTools();
    renderTools(tools);
    elements.status.textContent = `${context.courses.length} course(s) loaded · ${tools.length} tool(s) available`;
}

main().catch(error => {
    console.error('[CourseKit Toolkit]', error);
    elements.status.textContent = `Toolkit error: ${error.message}`;
});
