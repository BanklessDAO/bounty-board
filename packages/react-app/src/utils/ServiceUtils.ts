export default {
  formatDisplayDate(dateIso: string): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
    return new Date(dateIso).toLocaleString('en-US', options)
  },
  getMongoURI(): string {
    const uri =
      process.env.BUILD_ENV === 'production'
        ? process.env.PROD_MONGODB_URI
        : process.env.DEV_MONGODB_URI
    return uri || ''
  },
}
