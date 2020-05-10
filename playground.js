
const departmentsList = [{"Cardiac Catheterization": 1}, {"Surgery Care": 2}, {"Cardiology": 3}, {"Emergency": 4}]
for (let i = 0; i < departmentsList.length; i++)
{
    const key = Object.keys(departmentsList[i])[0];
    console.log(key)
    // console.log(departmentsList[i]);
    // Department.create({
    //     Name: departmentsList[i]
    // });
}

// console.log(departmentsList[2]['Cardiology'])


// x = "Cardiology"
// const value = departmentsList.filter(dep => dep[x]);
//
// console.log(value[0][x])