#!/usr/bin/env python3
import os
import json
import re
from html.parser import HTMLParser
import xml.parsers.expat as expat

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_PATH = os.path.join(BASE_DIR, 'index.html')
OUTPUT_PATH = os.path.join(BASE_DIR, 'public', 'single-file-blogspot.html')

class XHTMLSerializer(HTMLParser):
    def __init__(self):
        super().__init__()
        self.result = []
        self.in_script = False
        self.in_style = False
        self.script_data = []
        self.style_data = []

    def handle_starttag(self, tag, attrs):
        t = tag.lower()
        if t == 'html':
            self.result.append('<html b:css="false" b:defaultwidgetversion="2" b:layoutsversion="3" b:responsive="true" class="scroll-smooth" expr:dir="data:blog.languageDirection" lang="bn" xmlns="http://www.w3.org/1999/xhtml" xmlns:b="http://www.google.com/2005/gml/b" xmlns:data="http://www.google.com/2005/gml/data" xmlns:expr="http://www.google.com/2005/gml/expr">')
            return
        if t == 'script':
            self.in_script = True
            self.script_data = []
            attr_str = self.format_attrs(attrs)
            self.result.append(f'<{tag}{attr_str}>')
            return
        if t == 'style':
            self.in_style = True
            self.style_data = []
            attr_str = self.format_attrs(attrs)
            self.result.append(f'<{tag}{attr_str}>')
            return
        if t == 'body':
            attr_str = self.format_attrs(attrs)
            b_sec = '\n    <!-- Blogger Mandatory XML Section (bypassed for standalone responsive store) -->\n    <b:section id="main" showaddelement="no" style="display:none;">\n      <b:widget id="Blog1" locked="true" title="Blog Posts" type="Blog" version="2">\n        <b:includable id="main">\n        </b:includable>\n      </b:widget>\n    </b:section>\n'
            self.result.append(f'<{tag}{attr_str}>{b_sec}')
            return

        void_tags = {'img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'}
        attr_str = self.format_attrs(attrs)
        if t in void_tags:
            self.result.append(f'<{tag}{attr_str} />')
        else:
            self.result.append(f'<{tag}{attr_str}>')

    def handle_endtag(self, tag):
        t = tag.lower()
        void_tags = {'img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'}
        if t in void_tags:
            return
        if t == 'head':
            skins = '\n    <b:skin><![CDATA[\n      /* Blogger Master Responsive Theme - Safe Guard BD */\n      #navbar-iframe, .navbar, .widget-item-control, .quickedit, .post-feeds, .feed-links, .status-msg-wrap {\n        display: none !important;\n        visibility: hidden !important;\n        height: 0 !important;\n        opacity: 0 !important;\n        pointer-events: none !important;\n      }\n      html, body {\n        margin: 0 !important;\n        padding: 0 !important;\n        width: 100% !important;\n        min-width: 100% !important;\n        overflow-x: hidden !important;\n      }\n    ]]></b:skin>\n'
            self.result.append(skins + '</head>')
            return
        if t == 'script':
            self.in_script = False
            code = ''.join(self.script_data)
            clean_code = code.strip()
            if clean_code:
                # Strip any existing CDATA markers to avoid duplicates
                if clean_code.startswith('//<![CDATA['):
                    clean_code = clean_code[11:]
                elif clean_code.startswith('<![CDATA['):
                    clean_code = clean_code[9:]
                if clean_code.endswith('//]]>'):
                    clean_code = clean_code[:-5]
                elif clean_code.endswith(']]>'):
                    clean_code = clean_code[:-3]
                self.result.append('//<![CDATA[\n' + clean_code.strip() + '\n//]]>\n</script>')
            else:
                self.result.append('</script>')
            return
        if t == 'style':
            self.in_style = False
            css = ''.join(self.style_data).strip()
            if css:
                if css.startswith('/*<![CDATA[*/'):
                    css = css[13:]
                if css.endswith('/*]]>*/'):
                    css = css[:-7]
                self.result.append('/*<![CDATA[*/\n' + css.strip() + '\n/*]]>*/\n</style>')
            else:
                self.result.append('</style>')
            return
        self.result.append(f'</{tag}>')

    def handle_data(self, data):
        if self.in_script:
            self.script_data.append(data)
        elif self.in_style:
            self.style_data.append(data)
        else:
            escaped = data.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            self.result.append(escaped)

    def handle_comment(self, data):
        self.result.append(f'<!--{data}-->')

    def format_attrs(self, attrs):
        parts = []
        for name, val in attrs:
            if val is None:
                if name.lower() == 'crossorigin':
                    parts.append('crossorigin="anonymous"')
                else:
                    parts.append(f'{name}="{name}"')
            else:
                escaped_val = val.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;').replace('>', '&gt;')
                parts.append(f'{name}="{escaped_val}"')
        return (' ' + ' '.join(parts)) if parts else ''

def build_blogger_theme():
    with open(INDEX_PATH, 'r', encoding='utf-8') as f:
        html = f.read()

    # Load live JSON data
    def load_json(name, fallback):
        p = os.path.join(BASE_DIR, 'data', name)
        if os.path.exists(p):
            with open(p, 'r', encoding='utf-8') as f:
                return json.load(f)
        return fallback

    products = load_json('products.json', [])
    categories = load_json('categories.json', [])
    site_content = load_json('site_content.json', {})
    why_us = load_json('why_us.json', [])
    reviews = load_json('reviews.json', [])
    faqs = load_json('faqs.json', [])
    payment_methods = load_json('payment_methods.json', [])

    # Inject live data
    html = re.sub(r'const\s+DEFAULT_PRODUCTS\s*=\s*\[[\s\S]*?\];', lambda m: 'const DEFAULT_PRODUCTS = ' + json.dumps(products, indent=2, ensure_ascii=False) + ';', html)
    html = re.sub(r'const\s+DEFAULT_CATEGORIES\s*=\s*\[[\s\S]*?\];', lambda m: 'const DEFAULT_CATEGORIES = ' + json.dumps(categories, indent=2, ensure_ascii=False) + ';', html)
    html = re.sub(r'const\s+DEFAULT_PAYMENT_METHODS\s*=\s*\[[\s\S]*?\];', lambda m: 'const DEFAULT_PAYMENT_METHODS = ' + json.dumps(payment_methods, indent=2, ensure_ascii=False) + ';', html)
    html = re.sub(r'const\s+DEFAULT_SITE_CONTENT\s*=\s*\{[\s\S]*?\n\s*\};', lambda m: 'const DEFAULT_SITE_CONTENT = ' + json.dumps(site_content, indent=2, ensure_ascii=False) + ';', html)
    html = re.sub(r'const\s+DEFAULT_WHY_US\s*=\s*\[[\s\S]*?\];', lambda m: 'const DEFAULT_WHY_US = ' + json.dumps(why_us, indent=2, ensure_ascii=False) + ';', html)
    html = re.sub(r'const\s+DEFAULT_REVIEWS\s*=\s*\[[\s\S]*?\];', lambda m: 'const DEFAULT_REVIEWS = ' + json.dumps(reviews, indent=2, ensure_ascii=False) + ';', html)
    html = re.sub(r'const\s+DEFAULT_FAQS\s*=\s*\[[\s\S]*?\];', lambda m: 'const DEFAULT_FAQS = ' + json.dumps(faqs, indent=2, ensure_ascii=False) + ';', html)

    # Remove standard doctype for XHTML conversion
    html_clean = re.sub(r'<!doctype[^>]*>', '', html, flags=re.IGNORECASE)

    # Parse and serialize into 100% compliant XHTML
    parser = XHTMLSerializer()
    parser.feed(html_clean)
    body_xhtml = ''.join(parser.result)

    full_blogger_theme = '<?xml version="1.0" encoding="UTF-8" ?>\n<!DOCTYPE html>\n' + body_xhtml

    # Verify with Expat XML parser
    test_xml = re.sub(r'<!DOCTYPE[^>]*>', '', body_xhtml)
    p = expat.ParserCreate()
    p.Parse(test_xml)

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(full_blogger_theme)

    print(f'Successfully built 100% valid Blogger XML theme: {OUTPUT_PATH} ({len(full_blogger_theme)} bytes)')
    return full_blogger_theme

if __name__ == '__main__':
    build_blogger_theme()
