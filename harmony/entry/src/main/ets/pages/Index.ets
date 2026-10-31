import { webview } from '@kit.ArkWeb';
@Entry
@Component
struct Index {
  private controller: webview.WebviewController = new webview.WebviewController();
  build() {
    Column() {
      Web({ src: 'https://jianghao313yan.github.io/ATOM-Workbench/', controller: this.controller })
        .javaScriptAccess(true).domStorageAccess(true).imageAccess(true)
        .width('100%').height('100%')
    }.width('100%').height('100%')
  }
}