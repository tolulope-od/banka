export default {
  users: [
    {
      id: 1,
      email: 'obiwan@therebellion.com',
      firstName: 'Obiwan',
      lastName: 'Kenobi',
      password: 'password1',
      address: 'Lane 251, The Empire',
      phoneNumber: '08044039084',
      type: 'staff',
      isAdmin: true,
      createdAt: Date.now()
    },
    {
      id: 2,
      email: 'thor@avengers.com',
      firstName: 'Thor',
      lastName: 'Odinson',
      password: 'password123',
      address: 'Asgardian Empire',
      phoneNumber: '09070883920',
      type: 'client',
      isAdmin: false,
      createdAt: Date.now()
    },
    {
      id: 3,
      email: 'olegunnar@manutd.com',
      firstName: 'Ole',
      lastName: 'Solksjaer',
      password: 'olesathewheel',
      address: 'Old Trafford, Manchester',
      phoneNumber: '08024098738',
      type: 'client',
      isAdmin: false,
      createdAt: Date.now()
    },
    {
      id: 4,
      email: 'kyloren@vader.com',
      firstName: 'Kylo',
      lastName: 'Ren',
      password: 'bensolo',
      address: 'Tatooine, Planet C53',
      phoneNumber: '09082009398',
      type: 'staff',
      isAdmin: false,
      createdAt: Date.now()
    }
  ]
};
