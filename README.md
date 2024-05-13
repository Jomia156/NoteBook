# Application Notebook

## API Documentation

### Users

#### Login user
> Path: */api/user/login*

> Method: *GET*

QueryString: 

```
{
    login: string
    password: string
}
``` 
 
Request: 

``` 
{
    status: number
    description: string
    code: string,
    data: {
        accessToke: string,
        refreshToken: string
    }
    
}
```

#### Register user
> Path: */api/user/register*

> Method: *POST*

Body: 

```
{
    name: string
    login: string
    password: string
    email: string
}
``` 

Request: 

``` 
{
    status: number
    description: string
    code: string
}
```

#### Login for refresh token
> Path: */api/user/loginForRefresh*

> Method: *Get*

Headers: 

```
{
    Authorization: string
}
``` 

Request: 

``` 
{
    status: number
    description: string
    code: string,
    data: {
        accessToke: string,
        refreshToken: string
    }
}
```

#### Get user data
> Path: */api/user*

> Method: *GET*

Headers: 

```
{
    Authorization: string
}
```

Request: 

``` 
{
    status: number
    description: string
    code: string,
    data: {
        _id: ObjectId,
        id: string
        login: string
        name: string
        email: string
        passwordHash: string
        avatar: string | null,
        verified: Boolean,
        notes: Array<string>,
        events: Array<string>,
        plans: Array<string>,
        schedules: TColendar
    }
}
```

#### Remove user
> Path: */api/user*

> Method: *DELETE*

Headers: 

```
{
    Authorization: string
}
```

Request: 

``` 
{
    status: number
    description: string
    code: string
}
```


#### Verification user
> Path: */api/user/verification*

> Method: *GET*

Headers: 

```
{
    Authorization: string
}
```

QueryString: 

```
{
    verificationCode: string
}
```

Request: 

``` 
{
    status: number
    description: string
    code: string
}
```

#### Update verification session for user
> Path: */api/user/verificationReload*

> Method: *GET*

Headers: 

```
{
    Authorization: string
}
```

Request: 

``` 
{
    status: number
    description: string
    code: string
}
```
#### Update user data
> Path: */api/user/verificationReload*

> Method: *PUT*

Headers: 

```
{
    Authorization: string
}
```

Body: 
```
{
    name: string,
    avatar: string,
    password: string
}
```

Request: 

``` 
{
    status: number
    description: string
    code: string
}
```
#### Get list collection for user (events, notes)
> Path: */api/user/list/:listType*

> Method: *PUT*

Headers: 

```
{
    Authorization: string
}
```

Request: 

``` 
{
    status: number
    description: string
    code: string,
    data: Array<string>
}
```

### Files

### Get File
> Path: */api/file/:filename*

> Method: *GET*

Request: 

``` 
    //Buffer
```

### Upload File
> Path: */api/file*

> Method: *POST*

> Headers: 

```
{
    Authorization: string
}
```


Body: 

```
    //FormData
```

Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string,
    data:string
}
```

### Events

### Get events for user

> Path: */api/event/:eventId*

> Method: *GET*

Headers: 

```
{
    Authorization: string
}
```

Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string,
    data: {
            _id: ObjectId;
        id: string;
        userId: string;
        title: string;
        description: string;
        date: string;
        time: string;
        geoposition: string;
        avatar: string | null;
        notes: Array<string>;
        plans: Array<string>;
    }
}
```

### Create events for user

> Path: */api/event*

> Method: *POST*

Headers: 

```
{
    Authorization: string
}
```

Body:

```
{
    title: string;
    decription: string;
    date: string;
    time: string;
    geoposition: string;
}
```

Request:
```
    {
        status:number,
        desctiptinon: sting,
        code:string
    }
```

### Remove events for user

> Path: */api/event/:eventId*

> Method: *DELETE*

Headers: 

```
{
    Authorization: string
}
```

Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string
}
```


### Update events for user

> Path: */api/event*

> Method: *PUT*

Headers: 

```
{
    Authorization: string
}
```
Body:

```
{
    id: string;
    userId: string;
    title: string;
    description: string;
    date: string;
    time: string;
    geoposition: string;
    avatar: string | null;
    notes: Array<string>;
    plans: Array<string>;
}
```

Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string
}
```

### Notes

#### Get Note for user
> Path: */api/Users/note/:noteId*

> Method: *GET*

Headers: 

```
{
    Authorization: string
}
```

Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string,
    data: {
        id?: string,
        ownerId?: string,
        title?: string,
        content: {
            type: "text" | "list",
            body: string
        }
    }
}
```

#### Get Note for Event
> Path: */api/Events/note/:noteId*

> Method: *GET*

Headers: 

```
{
    Authorization: string
}
```

Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string,
    data: {
        id?: string,
        ownerId?: string,
        title?: string,
        content: {
            type: "text" | "list",
            body: string
        }
    }
}
```

#### Create Note for user
> Path: */api/user/note*

> Method: *POST*

Headers: 

```
{
    Authorization: string
}
```
Body:
```
{
    title?: string,
    content: {
        type: "text" | "list",
        body: string
    }
}
```

Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string,
    data: {
        id?: string,
        ownerId?: string,
        title?: string,
        content: {
            type: "text" | "list",
            body: string
        }
    }
}
```
#### Create Note for event
> Path: */api/event/:eventId/note*

> Method: *POST*

Headers: 

```
{
    Authorization: string
}
```
Body:
```
{
    title?: string,
    content: {
        type: "text" | "list",
        body: string
    }
}
```

Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string,
    data: {
        id?: string,
        ownerId?: string,
        title?: string,
        content: {
            type: "text" | "list",
            body: string
        }
    }
}
```
#### Get all notes for user
> Path: */api/user/notes*

> Method: *GET*

Headers: 

```
{
    Authorization: string
}
```
Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string,
    data: Array<{
        id?: string,
        ownerId?: string,
        title?: string,
        content: {
            type: "text" | "list",
            body: string
        }>
    }
}
```
#### Get all notes for event
> Path: */api/event/:eventId/notes*

> Method: *GET*

Headers: 

```
{
    Authorization: string
}
```
Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string,
    data: Array<{
        id?: string,
        ownerId?: string,
        title?: string,
        content: {
            type: "text" | "list",
            body: string
        }>
    }
}
```
#### Get all notes for user
> Path: */api/user/notes/:noteId*

> Method: *DELETE*

Headers: 

```
{
    Authorization: string
}
```
Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string
}
```
#### Get all notes for event
> Path: */api/event/:eventId:/notes/:noteId*

> Method: *DELETE*

Headers: 

```
{
    Authorization: string
}
```
Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string
}
```

### Schedules

#### Get schedules for month
> Path: */api/schedule*

> Method: *GET*

Headers: 

```
{
    Authorization: string
}
```

QueryString:
```
{
    date:string (MM.YY)
}
```

Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string,
    date: TColendar
}
```
#### Create task for schedules
> Path: */api/schedule/task*

> Method: *POST*

Headers: 

```
{
    Authorization: string
}
```

Body:
```
{
    date:string (dd.mm.YY),
    time:string, 
    title:string,
    description:string
}
```

Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string,
}
```
#### Update task for schedules
> Path: */api/schedule/task*

> Method: *PUT*

Headers: 

```
{
    Authorization: string
}
```

Body:
```
{
    taskId:string,
    date:string (dd.mm.YY),
    time:string, 
    title:string,
    description:string
}
```

Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string
}
```
#### Remove task for schedules
> Path: */api/schedule/task/:taskId*

> Method: *DELETE*

Headers: 

```
{
    Authorization: string
}
```

Request:
```
{
    status:number,
    desctiptinon: sting,
    code:string
}
```
