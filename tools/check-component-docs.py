#!/usr/bin/env python3
"""Check frontmatter and documented attributes against the CourseKit structural XSD."""
from pathlib import Path
import json, re, sys, xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
ns={'xs':'http://www.w3.org/2001/XMLSchema'}
schema=ET.parse(root/'framework/schemas/course-page.xsd').getroot()
types={x.get('name'):x for x in schema.findall('xs:complexType',ns)}
elements={x.get('name'):x for x in schema.findall('xs:element',ns)}
errors=[]
for directory in sorted((root/'framework/components').iterdir()):
    if not directory.is_dir():continue
    manifestfile=directory/'component.json'
    if not manifestfile.exists():continue
    manifest=json.loads(manifestfile.read_text())
    filename=directory/'COMPONENT.md'
    if not filename.exists():errors.append(str(filename)+': missing');continue
    doc=filename.read_text()
    match=re.match(r'\A---\n(.*?)\n---\n',doc,re.S)
    if not match:errors.append(str(filename)+': missing YAML front matter');continue
    fields=dict(m.groups() for line in match.group(1).splitlines() if (m:=re.match(r'^([\w-]+):\s*(.+)$',line)))
    if fields.get('id')!=manifest['id']:errors.append(str(filename)+': id does not match manifest')
    element=manifest.get('element',manifest['id'])
    if fields.get('element')!=element:errors.append(str(filename)+': element does not match manifest')
    if fields.get('status')!=('abstract' if manifest.get('abstract') else 'public'):errors.append(str(filename)+': abstract status mismatch')
    if manifest.get('abstract'):continue
    xe=elements.get(element)
    if xe is None:errors.append(str(filename)+': no XSD element '+element);continue
    typ=types.get(xe.get('type'))
    if typ is None:continue
    attrs={x.get('name') for x in typ.findall('.//xs:attribute',ns)}
    block=re.search(r'## XML contract\n(.*?)(?=\n## |\Z)',doc,re.S)
    documented=set(re.findall(r'^\| `([^`]+)` \|',block.group(1),re.M)) if block else set()
    if attrs!=documented:errors.append(str(filename)+': attributes mismatch (XSD='+str(sorted(attrs))+', docs='+str(sorted(documented))+')')
print('\n'.join(errors) if errors else 'All component documentation metadata and attributes match the manifests/XSD.')
sys.exit(bool(errors))
