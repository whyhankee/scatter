#Index

**Classes**

* [class: ApiService](#ApiService)
  * [new ApiService(iface, qname, options)](#new_ApiService)
* [class: makeError](#makeError)
  * [new makeError(name, errorProps, opts)](#new_makeError)

**Functions**

* [userSignUp(req)](#userSignUp)
* [userGetAuthToken
Validates username / password and returns a authToken(req)](#userGetAuthToken
Validates username / password and returns a authToken)
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

<a name="makeError"></a>
#class: makeError
**Members**

* [class: makeError](#makeError)
  * [new makeError(name, errorProps, opts)](#new_makeError)

<a name="new_makeError"></a>
##new makeError(name, errorProps, opts)
Generate a custom error class based on Error

**Params**

- name `String` - Name of your Error object .e.g. ErrorNotFound  
- errorProps `Object` - Properties to set in every created Object for this Error class  
- opts `Object` - Options  
  - addContext `Object` - Add context to message when building an Error  

**Returns**: `function` - The created error object  
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
<a name="userGetAuthToken
Validates username / password and returns a authToken"></a>
#userGetAuthToken
Validates username / password and returns a authToken(req)
**Params**

- req `m1cro.Request`  
  - username `String`  
  - password `String`  

**Returns**: `Object` - {token: 'authToken'}  
<a name="getMe"></a>
#getMe()
alias userGetMe
Retrieves users own information
    based on the users authToken

**Returns**: `User`  
