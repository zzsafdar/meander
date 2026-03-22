describe('Planner Flow', () => {
  beforeAll(async () => {
    await device.launchApp()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should display home screen with search bar', async () => {
    await expect(element(by.id('search-input'))).toBeVisible()
    await expect(element(by.id('search-submit'))).toBeVisible()
  })

  it('should enter prompt and navigate to itinerary screen', async () => {
    await element(by.id('search-input')).typeText('Coffee shops in Shoreditch')
    await element(by.id('search-input')).tapReturnKey()
    
    await waitFor(element(by.id('itinerary-list')))
      .toBeVisible()
      .withTimeout(10000)
    
    await expect(element(by.id('itinerary-map'))).toBeVisible()
  })

  it('should display itinerary stops', async () => {
    await element(by.id('search-input')).typeText('Coffee shops in Shoreditch')
    await element(by.id('search-input')).tapReturnKey()
    
    await waitFor(element(by.id('stop-card')))
      .toBeVisible()
      .withTimeout(10000)
    
    await expect(element(by.id('stop-card'))).toBeVisible()
  })

  it('should show map markers for stops', async () => {
    await element(by.id('search-input')).typeText('Coffee shops in Shoreditch')
    await element(by.id('search-input')).tapReturnKey()
    
    await waitFor(element(by.id('itinerary-map')))
      .toBeVisible()
      .withTimeout(10000)
    
    await expect(element(by.id('map-marker'))).toBeVisible()
  })

  it('should handle empty search input', async () => {
    await element(by.id('search-submit')).tap()
    
    await expect(element(by.id('search-input'))).toBeVisible()
  })
})
