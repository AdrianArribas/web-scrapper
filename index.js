/* eslint-disable no-tabs */
/* eslint-disable indent */

/* Instalamos node y playwright:
	1- npm init
	2- npm install
	3- npm i -D playwright
	4- npm install @playwright/test
	5- npm instal standard -D  --- esto es un linter de JS => https://www.npmjs.com/package/standard
	6- podemos hacerlo correr con node index.js
*/

const { chromium } = require('playwright')

// creamos un objeto shops con todas las tiendas a observar

const shops = [
	{
		vendor: 'Microsoft',
		url: 'https://xbox.com/es-es/configure/8WJ714N3RBTL',
		checkStock: async ({ page, vendor }) => {
			const content = await page.textContent('[aria-label="Finalizar la compra del pack"]') // comprobamos que una parte caracteristica del elemento a observar existe
			const hasStock = content.includes('Sin existencias') === false // miramos el contenido del elemento
			const namePhoto = ('screenshots/' + vendor + '.png')
			await page.screenshot({ path: namePhoto })
			return hasStock
		}
	},
	{
		vendor: 'Game',
		url: 'https://www.game.es/HARDWARE/PACK-CONSOLA/PACKS/XBOX-ALL-ACCESS-XBOX-SERIES-X/195998',
		checkStock: async ({ page, vendor }) => {
			const content = await page.textContent('.product-quick-actions')
			const hasStock = content.includes('Producto no disponible') === false
			const namePhoto = ('screenshots/' + vendor + '.png')
			await page.screenshot({ path: namePhoto })
			return hasStock
		}
	},
	{
		vendor: 'MediaMarkt',
		url: 'https://www.mediamarkt.es/es/product/_consola-microsoft-xbox-series-x-1-tb-ssd-negro-1487615.html',
		checkStock: async ({ page, vendor }) => {
			const content = await page.textContent('[data-product-online-status="CURRENTLY_NOT_AVAILABLE"]')
			const hasStock = content.includes('Este artículo no está disponible actualmente.') === false
			const namePhoto = ('screenshots/' + vendor + '.png')
			await page.screenshot({ path: namePhoto })
			return hasStock
		}
	}

];

(async () => {
	const browser = await chromium.launch() // lanzamos el chromiun
	const page = await browser.newPage()
	// const page = await browser.newPage() // creamos un objeto page

	for (const shop of shops) {
		const { checkStock, vendor, url } = shop
		await page.goto(url)
		const hasStock = await checkStock({ page, vendor })
		console.log(`${vendor}: ${hasStock ? 'DISPONIBLE !!! 😍' : 'no disponible 😢'}`)
	}
	await page.close()

	// creamos un promise.all que recorrera la funcion contenida en el metodo checkStock de cada buscqueda del array shops y esperará a que todo haya acabado
	/* 	const results = await Promise.all(
			shops.map(shop => ({
				vendor: shop.vendor,
				hasStock: await shop.checkStock({ browser, url: shop.url })
			}))
		) */

	/*
	await page.goto('https://xbox.com/es-es/configure/8WJ714N3RBTL') // definimos la pagina a observar
	await page.screenshot({ path: 'example.png' }) // podemos sacar un screenshot
	const content = await page.textContent('[aria-label="Finalizar la compra del pack"]') // comprobamos que una parte caracteristica del elemento a observar existe
	const hasStock = content.includes('Sin existencias') === false // miramos el contenido del elemento
	console.log({ shop: 'Microsoft', content, hasStock }) // mostramos resultados por consola
	  */
	await browser.close()
})()
