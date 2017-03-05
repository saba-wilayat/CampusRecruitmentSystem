import { TestintProjectPage } from './app.po';

describe('testint-project App', function() {
  let page: TestintProjectPage;

  beforeEach(() => {
    page = new TestintProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
