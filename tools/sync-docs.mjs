
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const force = process.argv.includes('--force');

const catalogs = [
    {
        source: 'framework/visual',
        destination: 'docs/components',
        manifest: 'component.json',
        documentation: 'COMPONENT.md',
        label: 'Visual component'
    },
    {
        source: 'framework/semantic',
        destination: 'docs/semantic',
        manifest: null,
        documentation: 'SEMANTIC.md',
        label: 'Semantic component'
    }
];

function readJSON(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function relativeLink(from, to) {
    return path.relative(path.dirname(from), to)
        .split(path.sep)
        .join('/');
}

function generatePage({
    name,
    label,
    manifest,
    manifestPath,
    schemaPath,
    outputPath
}) {
    const title = manifest?.id || name;

    const lines = [
        `# \`${title}\``,
        '',
        `${label} reference.`,
        ''
    ];

    if (manifest?.namespace) {
        lines.push(
            `**Namespace:** \`${manifest.namespace}\``,
            ''
        );
    }

    if (manifest?.element) {
        lines.push(
            `**Element:** \`${manifest.element}\``,
            ''
        );
    }

    if (manifest?.extends) {
        lines.push(
            `**Extends:** \`${manifest.extends}\``,
            ''
        );
    }

    if (manifestPath) {
        lines.push(
            `**Manifest:** [${path.basename(manifestPath)}](${relativeLink(outputPath, manifestPath)})`,
            ''
        );
    }

    if (schemaPath) {
        lines.push(
            `**Schema:** [${path.basename(schemaPath)}](${relativeLink(outputPath, schemaPath)})`,
            ''
        );
    }

    if (manifest) {
        lines.push(
            '## Manifest',
            '',
            '```json',
            JSON.stringify(manifest, null, 2),
            '```',
            ''
        );
    }

    return lines.join('\n');
}

function synchronize(catalog) {
    const src = path.join(root, catalog.source);
    const dest = path.join(root, catalog.destination);

    if (!fs.existsSync(src)) {
        throw new Error(
            `Source directory not found: ${src}`
        );
    }

    fs.mkdirSync(dest, { recursive: true });

    let created = 0;
    let updated = 0;
    let preserved = 0;

    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;

        const componentDir = path.join(src, entry.name);
        const outputPath = path.join(dest, `${entry.name}.md`);
        const documentationPath = path.join(
            componentDir,
            catalog.documentation
        );

        const manifestPath = catalog.manifest
            ? path.join(componentDir, catalog.manifest)
            : fs.readdirSync(componentDir)
                .filter(file => file.endsWith('.json'))
                .map(file => path.join(componentDir, file))[0];

        const schemaPath = fs.readdirSync(componentDir)
            .filter(file => file.endsWith('.xsd'))
            .map(file => path.join(componentDir, file))[0];

        if (!force && fs.existsSync(outputPath)) {
            preserved++;
            continue;
        }

        let content;

        if (fs.existsSync(documentationPath)) {
            content = fs.readFileSync(documentationPath, 'utf8');

            content = content.replaceAll(
                `(./${catalog.manifest || 'component.json'})`,
                `(${relativeLink(outputPath, manifestPath)})`
            );
        } else {
            const manifest = manifestPath && fs.existsSync(manifestPath)
                ? readJSON(manifestPath)
                : null;

            content = generatePage({
                name: entry.name,
                label: catalog.label,
                manifest,
                manifestPath,
                schemaPath,
                outputPath
            });
        }

        const existed = fs.existsSync(outputPath);

        fs.writeFileSync(outputPath, content, 'utf8');

        if (existed) updated++;
        else created++;
    }

    console.log(
        `${catalog.label}: ${created} created, ` +
        `${updated} updated, ${preserved} preserved.`
    );
}

for (const catalog of catalogs) {
    synchronize(catalog);
}

console.log('CourseKit documentation synchronized.');
