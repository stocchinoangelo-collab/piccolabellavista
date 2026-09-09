"""Source quality gates. Run: python -m unittest discover -s tests -p '*_test.py'."""
import json,re,unittest
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote,parse_qs
ROOT=Path(__file__).resolve().parents[1]
class Tags(HTMLParser):
 def __init__(self,text):
  super().__init__(); self.tags=[]; self.feed(text)
 def handle_starttag(self,tag,attrs): self.tags.append((tag,dict(attrs)))
class ContentTests(unittest.TestCase):
 def test_all_pages_have_complete_translations_and_resolvable_local_assets(self):
  dictionaries=json.loads((ROOT/'i18n.js').read_text().split(' = ',1)[1].rstrip(';\n'))
  for path in ROOT.glob('*.html'):
   for tag,attrs in Tags(path.read_text()).tags:
    for attr,value in attrs.items():
     if attr.startswith('data-i18n'):
      for lang in ['it','en','de']: self.assertTrue(dictionaries[lang].get(value),(path,lang,value))
    for attr in ['href','src']:
     value=attrs.get(attr,''); url=urlparse(value)
     if not url.scheme and url.path:
      self.assertTrue((ROOT/unquote(url.path)).exists(),(path,value))
     if url.hostname=='www.google.com':
      query=parse_qs(url.query); self.assertEqual(query.get('api'),['1'])
      self.assertTrue(query.get('query') or query.get('destination'))
 def test_one_handler_no_patch_observer_or_private_assets(self):
  js=(ROOT/'script.js').read_text()
  self.assertEqual(len(re.findall(r"addEventListener\('submit'",js)),1)
  for path in ROOT.glob('*.html'):
   content=path.read_text()
   for banned in ['QuantoBasta','Prenota ora','aggregateRating','/admin','pages.dev','MutationObserver','fix-modulo-whatsapp']:
    self.assertNotIn(banned,content)
 def test_home_order_and_card_counts(self):
  content=(ROOT/'index.html').read_text(); tags=Tags(content).tags
  sections=[attrs.get('id') for tag,attrs in tags if tag=='section']
  self.assertEqual(sections,[None,'casa','servizi','concierge','spiagge','cagliari','vicino','posizione','recensioni','prenota','faq','contatti'])
  beach_keys=re.findall(r'data-i18n="(beach(?!es)\w+Title)"',content)
  self.assertEqual(len(beach_keys),5)
  self.assertEqual(len(re.findall(r'data-i18n="city\w+Title"',content)),4)
  self.assertNotIn('meta name="keywords"',content)
 def test_no_unnecessary_form_fields(self):
  fields=[a for t,a in Tags((ROOT/'index.html').read_text()).tags if t=='input']
  self.assertEqual({a['name'] for a in fields},{'fullName','arrival','departure','guests'})
  guests=next(a for a in fields if a['name']=='guests')
  self.assertEqual((guests['min'],guests['max'],guests['step']),('1','2','1'))
 def test_retired_public_pages_are_noindex_and_out_of_sitemap(self):
  retired=['guida.html','consigli.html','ospiti (1).html','blocco-recensioni.html']
  sitemap=(ROOT/'sitemap.xml').read_text()
  for name in retired:
   content=(ROOT/name).read_text()
   self.assertRegex(content,r'<meta[^>]+name="robots"[^>]+content="noindex,follow"|<meta[^>]+content="noindex,follow"[^>]+name="robots"')
   self.assertNotIn(f'https://piccolabellavista.it/{name}',sitemap)
if __name__=='__main__': unittest.main()
