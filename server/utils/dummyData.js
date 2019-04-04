export default {
  users: [
    {
      id: 1,
      email: 'obiwan@therebellion.com',
      firstName: 'Obiwan',
      lastName: 'Kenobi',
      password: 'password1',
      address: 'Lane 251, The Empire',
      avatar: '/uploads/avatar/obiwan.jpg',
      phoneNumber: '08044039084',
      type: 'staff',
      isAdmin: true,
      createdAt: new Date(2016, 1, 2)
    },
    {
      id: 2,
      email: 'thor@avengers.com',
      firstName: 'Thor',
      lastName: 'Odinson',
      password: 'password123',
      address: 'Asgardian Empire',
      avatar: '/uploads/avatar/thor.jpg',
      phoneNumber: '09070883920',
      type: 'client',
      isAdmin: false,
      createdAt: new Date(2019, 1, 12)
    },
    {
      id: 3,
      email: 'olegunnar@manutd.com',
      firstName: 'Ole',
      lastName: 'Solksjaer',
      password: 'olesathewheel',
      address: 'Old Trafford, Manchester',
      avatar: '/uploads/avatar/ole.jpg',
      phoneNumber: '08024098738',
      type: 'client',
      isAdmin: false,
      createdAt: new Date(2018, 4, 22)
    },
    {
      id: 4,
      email: 'kyloren@vader.com',
      firstName: 'Kylo',
      lastName: 'Ren',
      password: 'bensolo',
      address: 'Tatooine, Planet C53',
      avatar: '/uploads/avatar/kylo.jpg',
      phoneNumber: '09082009398',
      type: 'staff',
      isAdmin: false,
      createdAt: new Date(2016, 9, 2)
    }
  ]
};
