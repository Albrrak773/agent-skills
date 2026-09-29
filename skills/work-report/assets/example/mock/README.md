Mock "before" and "after" screens of the fictional Ledgerly invoice list. The example report's
screenshots were captured from these with the skill's own scripts, which doubles as a smoke test:

```bash
NODE_PATH=<scratch>/node_modules node scripts/shoot.mjs --base "file://$PWD/assets/example/mock" \
  --prefix before --out <scratch>/shots '/before.html@invoices@table'
scripts/optimize.sh <scratch>/shots/before-invoices.png assets/example/img/invoices-before.webp
scripts/optimize.sh <scratch>/shots/before-invoices.png assets/example/img/toolbar-before.webp 1500x120+1380+20
```
