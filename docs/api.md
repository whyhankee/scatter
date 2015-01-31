#Index

**Classes**

* [class: ApiService](#ApiService)
  * [new ApiService(iface, qname, options)](#new_ApiService)

**Functions**

* [userSignUp(req)](#userSignUp)
* [getAuthToken(req)](#getAuthToken)
* [getMe()](#getMe)
 
<a name="ApiService"></a>
#class: ApiService
**Members**

* [class: ApiService](#ApiService)
  * [new ApiService(iface, qname, options)](#new_ApiService)

<a name="new_ApiService"></a>
##new ApiService(iface, qname, options)
The main ApiService

**Params**

- iface `m1cro.Interface` - The m1cro interface this service is connected to  
- qname `String` - Name of the queue to listen to  
- options `Object` - Options  
  - config `Object`  

<a name="userSignUp"></a>
#userSignUp(req)
**Params**

- req `m1cro.Request`  
  - id `String` - (id of user to create) [optional]  
  - username `String`  
  - password `String`  
  - email `String`  

**Fires**

- event.user.signup.success(id: newUserId)

**Returns**: `User` - The created user  
<a name="getAuthToken"></a>
#getAuthToken(req)
Validates username / password and returns a authToken

**Params**

- req `m1cro.Request`  
  - username `String`  
  - password `String`  

**Returns**: `Object` - {token: 'authToken'}  
<a name="getMe"></a>
#getMe()
Retrieves users own information
    based on the users authToken

**Returns**: `User`  
