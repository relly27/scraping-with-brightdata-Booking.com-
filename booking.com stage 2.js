//////////////////////////////////////////////////////////////////////////////
//interaction code
close_popup('.e5aa33035e', '.b9def0936d');
country('nl')
let url = input.url.replace(/\.[a-z][a-z]\./, '.en.') + ';selected_currency=EUR'
navigate(url, {wait_until: 'domcontentloaded', timeout: 120e3, referer: 'https://www.booking.com/'})
wait_page_idle(3000, {timeout: 60e3})
wait_network_idle({ignore: [/bstatic/]})
wait('[data-testid="property-card"]')
//click('.bui-button--light.bui-button--large')
//wait('.bui-group--small')
// Need to click EUR currency which could be at any position
//$('.bui-traveller-header__currency').filter_includes('EUR').parent().parent().parent().click()
//wait('._814193827', { timeout: 60e3 })
let data = parse().hotels
console.log({l: data.length})
data.forEach(i => {
  i['Link Adress'] = new URL(i['Link Adress'])
  i.Price = new Money(i.Price.value, 'EUR')
  collect(i)
})



/////////////////////////////////////////////////////////////////////////////
//parser code
const getSingleHotel = hotels => hotels.slice(0, 25);

 
const hotels = $('[data-testid="property-card"]').toArray().map(card => {
  const $card = $(card)
  let link_adress = (new URL($card.find('h3>a').attr('href').trim(),location.href)).href
  //const price = +$card.find('._e885fdc12')?.text().trim().replace(',', '').split('€')[1] || 0;
  let price = $card.find('span[data-testid="price-and-discounted-price"]').text().replace(/[^0-9,]/g, '').replace(',', '') || $card.find('[data-testid="price-and-discounted-price"] > span:first-child').text().replace(/[^0-9,]/g, '').replace(',', '')
  return {
    Photo: 			$card.find('.e75f1d9859').attr('src'),
    "Hotel name": 	$card.find('[data-testid="title"]').text().trim(),
    "Link Adress":	link_adress,
    Location: 		$card.find('[data-testid="address"]').contents().get(0)?.nodeValue.trim(),
    "#stars": 		+$card.find('[data-testid="rating-stars"]').children('span').length || 0,
    RoomType: 		$card.find('[data-testid="recommended-units"] [role="none"] > div > div:first').text() || '',
    Beds:			$card.find('[data-testid="recommended-units"] [role="none"] > div > div:first + div').text() || '', 
    Cancellation : 	$card.find('[data-testid="recommended-units"] [role="none"] > div > div:last').text() || '',  
    Board: 			$card.find('._a9ad2d05c')?.text().trim() || 'N/A',
    Rating: 		+$card.find('[data-testid="review-score"] > div:first')?.text().replace(/[^0-9,]/, '').replace(',', '.') || 0.0,
    "#reviews": 	+$card.find('[data-testid="review-score"] > div:last-child > div:last-child')?.text().trim()|| 0,
    Price: {
      value: +price,
      symbol: "€",
    },
    Genius: $card.find('._fe1927d9e._0811a1b54.f251c2c127').length > 0 ? true : false,
    // url: 'https://www.booking.com' + $card.find('.hotel_name_link').attr('href'),
  }
})

return {
  hotels: input.hotel ? getSingleHotel(hotels) : hotels,
}