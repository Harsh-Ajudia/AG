const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../utils');

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);

  const employee = await context.prisma.employees.create({
    data: { ...args, password }
  });

  const token = jwt.sign({ userId: employee.id }, APP_SECRET);

  return {
    token,
    employee
  };
}

async function login(parent, args, context, info) {
  const employee = await context.prisma.employees.findFirst({
    where: {
      emailId: args.emailId
    }
  });

  if (!employee) {
    throw new Error('No such user found');
  }

  const valid = await bcrypt.compare(
    args.password,
    employee.password
  );
  if (!valid) {
    throw new Error('Invalid password');
  }
  const token = jwt.sign({ userId: employee.id }, APP_SECRET);
  return {
    token,
    employee
  };
}


module.exports = {
  signup,
  login,
};
