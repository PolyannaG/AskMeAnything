export default async function createUser(username,password, email){
    try{
        const resp=await fetch('https://manageuserssoaapp.herokuapp.com/authentication/register',{
            method: 'POST',
            headers:{'Content-type':'application/json'},
            credentials:'include',
            body: JSON.stringify({
                username : username,
                password : password,
                email : email
            })

        })
        // console.log(resp)
        console.log(resp)

        if (!resp.ok) console.log("response no ok")

        if (resp.status===201){
            const response=await resp.json()
            console.log(response)
            return true
        }
        else if (resp.status===400){
            const response=await resp.json()
            console.log(response)
            alert(response.message)
            return false
        }

    }
    catch (err){
        console.log(err)
    }
}