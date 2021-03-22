async function info(parent, args, context, info) {
  return "this"
}

async function getEmployees(parent, args, context, info) {
  
  if(!context.userId){
    throw new Error("Please Login in order to see employees")
  }
  const where = args.search
    ? {
      AND: [
        { firstName: { contains: args.search.firstName } },
        { lastName: { contains: args.search.lastName } },
        { employeeId: { contains: args.search.employeeId } }
      ],
    }
    : {};

  //default order
  let orderBy = args.orderBy.field ?  
  {
    [args.orderBy.field]: args.orderBy.order ? args.orderBy.order : 'asc' 
  } 
  : 
  {
    id: 'asc',
  }

  const employees = await context.prisma.employees.findMany({
      where,
      skip: args.skip,
      take: args.take,
      orderBy
    }
  )
  const count = await context.prisma.employees.count({ where });

  return {
    count,
    employees
  };
}

module.exports = {
  info,
  getEmployees
};
