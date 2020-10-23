import { assert, UnitTest } from '@ephox/bedrock-client';
import * as Compare from 'ephox/sugar/api/dom/Compare';
import * as Link from 'ephox/sugar/api/dom/Link';
import { SugarElement } from 'ephox/sugar/api/node/SugarElement';

UnitTest.test('LinkTest', () => {
  const realDoc = SugarElement.fromDom(document);
  const headNodes = document.head.children.length;

  const firstLink = Link.addStylesheet('fake://url1/');
  const secondLink = Link.addStylesheet('fake://url2/', realDoc);

  const assertStylesheetLink = (raw: HTMLLinkElement, url: string) => {
    assert.eq(url, raw.href);
    assert.eq('stylesheet', raw.rel);
    assert.eq('text/css', raw.type);
  };

  assert.eq(2, document.head.children.length - headNodes);

  // counting headNodes as "zero"
  const url1 = document.head.children[headNodes] as HTMLLinkElement;
  const url2 = document.head.children[headNodes + 1] as HTMLLinkElement;
  assert.eq(true, Compare.eq(firstLink, SugarElement.fromDom(url1)), 'first link element was not equal');
  assert.eq(true, Compare.eq(secondLink, SugarElement.fromDom(url2)), 'second link element was not equal');
  assertStylesheetLink(url1, 'fake://url1/');
  assertStylesheetLink(url2, 'fake://url2/');

  document.head.removeChild(url1);
  document.head.removeChild(url2);
});
