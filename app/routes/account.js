const _ = require('lodash')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const checkSignedIn = require('../middleware/checkSignedIn')

module.exports = router => {

  router.get('/account', checkSignedIn, (req, res) => {
    res.render("account/index", { 
      user: req.session.data.user
    })
  })

  router.post('/account/sign-in', async (req, res) => {
    // Get email from form
    const email = _.get(req.body, 'signIn.emailAddress')

    // Put current user into session so that we know if and who is signed in
    req.session.data.user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        units: {
          include: {
            unit: true
          }
        }
      }
    })
    res.redirect('/overview')
  })

  router.get('/account/sign-out', (req, res) => {
    req.session.data.user = null
    res.redirect('/account/sign-in')
  })

  router.get('/account/sign-in', (req, res) => {
    res.render('/account/sign-in')
  })

}