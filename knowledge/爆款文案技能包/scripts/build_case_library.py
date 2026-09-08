#!/usr/bin/env python3
import argparse, json, re, zipfile
from pathlib import Path


def read_source(path: Path):
    if path.suffix.lower() == '.zip':
        with zipfile.ZipFile(path) as z:
            for name in z.namelist():
                if name.lower().endswith('.md'):
                    yield Path(name).name, z.read(name).decode('utf-8', errors='ignore')
    else:
        for p in path.rglob('*.md'):
            yield p.name, p.read_text('utf-8', errors='ignore')


def field(txt, name):
    m = re.search(rf'^- {re.escape(name)}：?(.*)$', txt, re.M)
    return m.group(1).strip() if m else ''


def section(txt, heading):
    m = re.search(rf'^## {re.escape(heading)}\s*\n([\s\S]*?)(?=\n## |\Z)', txt, re.M)
    return m.group(1).strip() if m else ''


def num(x):
    s = re.sub(r'[^0-9]', '', x or '')
    return int(s) if s else 0


def parse(name, txt):
    m = re.search(r'^#\s+(.+)$', txt, re.M)
    title = m.group(1).strip() if m else Path(name).stem
    desc = section(txt, '描述')
    script = section(txt, '口播文案')
    tags = re.findall(r'#([^\s#]+)', desc)
    return {
        'case_id': name.split('_',1)[0],
        'title': title,
        'author': field(txt, '作者'),
        'likes': num(field(txt, '点赞')),
        'comments': num(field(txt, '评论')),
        'publish_time': field(txt, '发布时间'),
        'tags': tags,
        'description': desc,
        'script': script,
        'domain': '',
        'content_form': '',
        'target_audience': [],
        'core_problem': [],
        'core_promise': '',
        'hook_type': [],
        'emotion': [],
        'conflict': [],
        'structure': [],
        'retention_devices': [],
        'proof_devices': [],
        'cta_type': [],
        'golden_lines': [],
        'strengths': [],
        'weaknesses': [],
        'copy_mechanisms': [],
        'originality_risk': 0
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('source', help='zip file or directory containing markdown files')
    ap.add_argument('-o','--output',default='cases.jsonl')
    args = ap.parse_args()
    out = Path(args.output)
    count = 0
    with out.open('w',encoding='utf-8') as f:
        for name, txt in read_source(Path(args.source)):
            row = parse(name, txt)
            f.write(json.dumps(row, ensure_ascii=False) + '\n')
            count += 1
    print(f'written {count} cases -> {out}')

if __name__ == '__main__':
    main()
