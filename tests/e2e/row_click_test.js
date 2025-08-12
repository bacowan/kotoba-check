const puppeteer = require('puppeteer');
const timeout = 5000;

const rowClickTest = async (page) => {
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('button.shepherd-button-secondary')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 47.5103759765625,
                y: 14.0625,
              },
            });
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            selectors: [
                '#new-word-list tr'
            ],
            operator: "==",
            count: 1
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('td:nth-of-type(6) svg')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 12,
                y: 1.5208282470703125,
              },
            });
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            selectors: [
                '#new-word-list tr'
            ],
            operator: "==",
            count: 0
        }, targetPage, timeout);
    }
    {
        // the total number of pages in these tests should always be 1
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            selectors: [
                '#total-pages'
            ],
            operator: "==",
            count: 1
        }, targetPage, timeout);
        
        const totalPagesText = await targetPage.$eval('#total-pages', el => el.textContent.trim());
        if (totalPagesText !== '1') {
            throw new Error(`#total-pages text is "${totalPagesText}", expected "1"`);
        }
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('#deck-tab')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 28.166656494140625,
                y: 24.854164123535156,
              },
            });
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            selectors: [
                '#deck-list tr'
            ],
            operator: "==",
            count: 2
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('#deck-list tr:nth-of-type(1) button')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 15,
                y: 14.520828247070312,
              },
            });
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            selectors: [
                '#deck-list tr'
            ],
            operator: "==",
            count: 1
        }, targetPage, timeout);
    }
    {
        // the total number of pages in these tests should always be 1
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            selectors: [
                '#total-pages'
            ],
            operator: "==",
            count: 1
        }, targetPage, timeout);
        
        const totalPagesText = await targetPage.$eval('#total-pages', el => el.textContent.trim());
        if (totalPagesText !== '1') {
            throw new Error(`#total-pages text is "${totalPagesText}", expected "1"`);
        }
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('#new-words-tab')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 108,
                y: 30.854164123535156,
              },
            });
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            selectors: [
                '#new-word-list tr'
            ],
            operator: "==",
            count: 1
        }, targetPage, timeout);
    }
    {
        // the total number of pages in these tests should always be 1
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            selectors: [
                '#total-pages'
            ],
            operator: "==",
            count: 1
        }, targetPage, timeout);
        
        const totalPagesText = await targetPage.$eval('#total-pages', el => el.textContent.trim());
        if (totalPagesText !== '1') {
            throw new Error(`#total-pages text is "${totalPagesText}", expected "1"`);
        }
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('td:nth-of-type(5) line')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 13,
                y: 13.520828247070312,
              },
            });
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            selectors: [
                '#new-word-list tr'
            ],
            operator: "==",
            count: 0
        }, targetPage, timeout);
    }
    {
        // the total number of pages in these tests should always be 1
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            selectors: [
                '#total-pages'
            ],
            operator: "==",
            count: 1
        }, targetPage, timeout);
        
        const totalPagesText = await targetPage.$eval('#total-pages', el => el.textContent.trim());
        if (totalPagesText !== '1') {
            throw new Error(`#total-pages text is "${totalPagesText}", expected "1"`);
        }
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('#hidden-tab')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 44.916656494140625,
                y: 4.854164123535156,
              },
            });
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            selectors: [
                '#hidden-list tr'
            ],
            operator: "==",
            count: 2
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('tr:nth-of-type(1) svg')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 22,
                y: 2.5208282470703125,
              },
            });
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            selectors: [
                '#hidden-list tr'
            ],
            operator: "==",
            count: 1
        }, targetPage, timeout);
    }
    {
        // the total number of pages in these tests should always be 1
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            selectors: [
                '#total-pages'
            ],
            operator: "==",
            count: 1
        }, targetPage, timeout);
        
        const totalPagesText = await targetPage.$eval('#total-pages', el => el.textContent.trim());
        if (totalPagesText !== '1') {
            throw new Error(`#total-pages text is "${totalPagesText}", expected "1"`);
        }
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('#new-words-tab')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 107,
                y: 12.854164123535156,
              },
            });
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            selectors: [
                '#new-word-list tr'
            ],
            operator: "==",
            count: 1
        }, targetPage, timeout);
    }

    async function waitForElement(step, frame, timeout) {
      const {
        count = 1,
        operator = '>=',
        visible = true,
        properties,
        attributes,
      } = step;
      const compFn = {
        '==': (a, b) => a === b,
        '>=': (a, b) => a >= b,
        '<=': (a, b) => a <= b,
      }[operator];
      await waitForFunction(async () => {
        const elements = await querySelectorsAll(step.selectors, frame);
        let result = compFn(elements.length, count);
        const elementsHandle = await frame.evaluateHandle((...elements) => {
          return elements;
        }, ...elements);
        await Promise.all(elements.map((element) => element.dispose()));
        if (result && (properties || attributes)) {
          result = await elementsHandle.evaluate(
            (elements, properties, attributes) => {
              for (const element of elements) {
                if (attributes) {
                  for (const [name, value] of Object.entries(attributes)) {
                    if (element.getAttribute(name) !== value) {
                      return false;
                    }
                  }
                }
                if (properties) {
                  if (!isDeepMatch(properties, element)) {
                    return false;
                  }
                }
              }
              return true;

              function isDeepMatch(a, b) {
                if (a === b) {
                  return true;
                }
                if ((a && !b) || (!a && b)) {
                  return false;
                }
                if (!(a instanceof Object) || !(b instanceof Object)) {
                  return false;
                }
                for (const [key, value] of Object.entries(a)) {
                  if (!isDeepMatch(value, b[key])) {
                    return false;
                  }
                }
                return true;
              }
            },
            properties,
            attributes
          );
        }
        await elementsHandle.dispose();
        return result === visible;
      }, timeout);
    }

    async function querySelectorsAll(selectors, frame) {
      for (const selector of selectors) {
        const result = await querySelectorAll(selector, frame);
        if (result.length) {
          return result;
        }
      }
      return [];
    }

    async function querySelectorAll(selector, frame) {
      if (!Array.isArray(selector)) {
        selector = [selector];
      }
      if (!selector.length) {
        throw new Error('Empty selector provided to querySelectorAll');
      }
      let elements = [];
      for (let i = 0; i < selector.length; i++) {
        const part = selector[i];
        if (i === 0) {
          elements = await frame.$$(part);
        } else {
          const tmpElements = elements;
          elements = [];
          for (const el of tmpElements) {
            elements.push(...(await el.$$(part)));
          }
        }
        if (elements.length === 0) {
          return [];
        }
        if (i < selector.length - 1) {
          const tmpElements = [];
          for (const el of elements) {
            const newEl = (await el.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
            if (newEl) {
              tmpElements.push(newEl);
            }
          }
          elements = tmpElements;
        }
      }
      return elements;
    }

    async function waitForFunction(fn, timeout) {
      let isActive = true;
      const timeoutId = setTimeout(() => {
        isActive = false;
      }, timeout);
      while (isActive) {
        const result = await fn();
        if (result) {
          clearTimeout(timeoutId);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw new Error('Timed out');
    }
};

module.exports = { rowClickTest }