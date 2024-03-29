////////////////////////////////////////////////////////////////////////////////////////////////
//interection code
/*
* check_in & check_out - text with dot separator 
* For a children data needed age of each child - text with " / " separator
*/

/*
* check_in & check_out - text with dot separator 
* For a children data needed age of each child - text with " / " separator
*/

close_popup('#onetrust-accept-btn-handler', '#onetrust-accept-btn-handler')

checkInputDates()

const hotelName = input["hotel name"]

country('nl')
navigate('https://www.booking.com/',{wait_until: 'domcontentloaded', timeout: 45e3, referer: 'https://www.booking.com/'})
wait('.ce45093752')
const children = input.children && input.children?.split(/\s*\/\s*/).length > 0 ? input.children?.split(/\s*\/\s*/) : []
// const children = '' === input.children?.trim() ? [] : input.children?.split(/\s*\/\s*/)
//const checkIn = input.check_in?.split('.')
//const checkOut = input.check_out?.split('.')
// Place
wait_page_idle(2000)
type('input.ce45093752', input.place || hotelName, {replace: true})
wait_page_idle(3000)
click('[data-testid="searchbox-dates-container"]')
wait_visible('[data-testid="searchbox-datepicker-calendar"]')

//select date one 

let date1 = input.check_in;
let dateArra1 = date1.split(".");
let dateN1 = new Date(`${dateArra1[2]}-${dateArra1[1]}-${dateArra1[0]}`);

let Year1 = dateN1.getFullYear();
let Month1 = dateN1.getMonth() + 1 ;
let day1 = dateN1.getDate() + 1;

// add leading zeros if necessary
if (Month1 < 10) {
  Month1 = "0" + Month1;
}
if (day1 < 10) {
  day1 = "0" + day1;
}

let dateNew1 = `${Year1}-${Month1}-${day1}`;
console.log(dateNew1);

//select date two

let date2 = input.check_out;
let dateArra2 = date2.split(".");
let dateN2 = new Date(`${dateArra2[2]}-${dateArra2[1]}-${dateArra2[0]}`);

let Year2 = dateN2.getFullYear();
let Month2 = dateN2.getMonth() + 1 ;
let day2 = dateN2.getDate() + 1;

// add leading zeros if necessary
if (Month2 < 10) {
  Month2 = "0" + Month2;
}
if (day1 < 10) {
  day2 = "0" + day2;
}

let dateNew2 = `${Year2}-${Month2}-${day2}`;
console.log(dateNew2);

wait(2e3)
click(`[data-date="${dateNew1}"]`)
wait(2e3)
click(`[data-date="${dateNew2}"]`)
wait(2e3)

//close date

// Adults

click('[data-testid="occupancy-config"]')
wait(3e3)

if (input.adults < 2){
  wait(1000)
  //click('#group_adults ~ .bui-stepper__subtract-button')
  click('.e98c626f34:first ~ .fc63351294.a822bdf511.e3c025e003.fa565176a8.f7db01295e.c334e6f658.e1b7cfea84.cd7aa7c891')
}
if (input.adults > 2) {
  for (let i = 2; i < input.adults; i++) {
    wait(1000)
    //click('#group_adults ~ .bui-stepper__add-button')
    click('.e98c626f34:first ~ .fc63351294.a822bdf511.e3c025e003.fa565176a8.f7db01295e.c334e6f658.e1b7cfea84.d64a4ea64d')
  }
}
wait_page_idle(2000)
// Children
for (let i = 0; i < children.length; i++){
  console.log(children[i], i)
  while(true) {
      try {
          //click('#group_children ~ .bui-stepper__add-button')
        click('.e98c626f34 ~ .fc63351294.a822bdf511.e3c025e003.fa565176a8.f7db01295e.c334e6f658.e1b7cfea84.d64a4ea64d')
          wait(`[data-group-child-age="${i}"]`)
          select(`[data-group-child-age="${i}"]`, children[i])
          break;
      } catch(e) { }
  }
  wait(500)
}
wait(2000)
// Rooms
if (input.rooms > 1) {
  for (let i = 1; i < input.rooms; i++)
    click('.e98c626f34 ~ .fc63351294.a822bdf511.e3c025e003.fa565176a8.f7db01295e.c334e6f658.e1b7cfea84.d64a4ea64d')
}




// Submit
try{
  click('.fc63351294.a822bdf511.d4b6b7a9e7.cfb238afa1.c938084447.f4605622ad.aa11d0d5cd')
}catch{}
wait(2000)
// wait('#hotellist_inner', {timeout: 4e4})

/*console.log({checkIn, checkOut})
console.log(location.href)
let urlWithDates = location.href
  .replace('&checkin_month=', `&checkin_month=${checkIn[1]}`)
  .replace('&checkin_year=', `&checkin_year=${checkIn[2]}`)
  .replace('&checkout_month=', `&checkout_month=${checkOut[1]}`)
  .replace('&checkout_year=', `&checkout_year=${checkOut[2]}`)
  + `&checkin_monthday=${checkIn[0]}&checkout_monthday=${checkOut[0]}`

console.log(urlWithDates)
navigate(urlWithDates,{wait_until: 'domcontentloaded', timeout: 45e3, referer: 'https://www.booking.com/'})
*/
if (el_exists('[data-testid="pagination"]'))
    parse().urls.slice(0,10).forEach(url => next_stage({url, hotel: hotelName}))
else
    next_stage({url: location.href, hotel: hotelName})


function checkInputDates() {
  const [ day1, month1, year1] = input.check_in.split('.')
  const [ day2, month2, year2] = input.check_out.split('.')
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (new Date(year1, month1 - 1, day1) < today) throw new Error(`Select a check-in date that's in the future`)
  if (new Date(year1, month1 - 1, day1) > new Date(year2, month2 - 1, day2)) throw new Error(`Checkout date should be same or older then checkin`)
}




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//parser code

const propertiesCount = +$('[data-component="arp-header"] h1').text().replace(/[^0-9]/g,'')
const pagesCount = Math.ceil(propertiesCount / 25)
let pageLinkBase = new URL($('[data-testid="breadcrumbs"] li:last-child a').attr('href'))

let urls = []
for (i = 0; i < pagesCount; i++) {
  pageLinkBase.searchParams.set('offset', 25 * i)
  urls.push(pageLinkBase.toString())
}
return {
  total: propertiesCount,
  pages: pagesCount,
  urls,
}