# Consistent Task Dispatcher
![Deno Test](https://github.com/10yung/Consistent-Tasks-Dispatcher/workflows/Deno%20Test/badge.svg)
![MIT](https://img.shields.io/github/license/10yung/Consistent_Task_Dispatcher)
![version](https://img.shields.io/github/v/release/10yung/Consistent_Task_Dispatcher)

## Description 
This is a task dispatcher widget implemented by consistent hashing algorithm. Each server(worker) will be dispatched by a set of tasks. Input a list of `ServerName`, `TaskName` and `SECRET_KEY`, `get_server_task_map` will map the tasks to the respond server. This pacakge depend on [hmac](https://denopkg.com/chiefbiiko/hmac/mod.ts) for javascript hashing.

## Usage
```javascript
import { get_hashed, create_hash_ring, get_server_task_map } from './dispatcher/dispatcher.ts'

let key = 'my_secret_key'


let server_task_map = get_server_task_map(['Task0927', 'Task1029', 'Task0927', 'Task0426', 'Task1117'], ['Jane', 'Andy', 'Faith'], key)

// The server_task_map is servers (key) and their tasks (value: Array[string])
// {
//   Andy: [ "Task1029", "Task0426" ],
//   Jane: [ "Task1203", "Task0927", "Task0927", "Task1225" ],
//   Faith: []
// }


let hash_ring = create_hash_ring(['Task0927', 'Task1029', 'Task0927', 'Task0426', 'Task1117'], ['Jane', 'Andy', 'Faith'], key)

// The hash_ring is a list include tasks and  servers (ordered by hashed value)
// [
//   [ "Andy", "0a1c1ebe1a29e0eb0f9e82c5bff8826b2a183d6d4f8d5ac43fe44a6183409f36" ],
//   [ "Task0927", "533a61318ef3cffb80773718a633724836c6d3e447abf8cf46f260bb55a4a5bf" ],
//   [ "Task0927", "533a61318ef3cffb80773718a633724836c6d3e447abf8cf46f260bb55a4a5bf" ],
//   [ "Jane", "822b9cc0c8402cd0f2b8b2daf974b8cb89b9ffe6eb2534ff49e38d9d27441f01" ],
//   [ "Faith", "84e75bc86309548e77b7966483dd96f4e93f5443e9a7d70385f3b5d629d6edfa" ],
//   [ "Task1029", "a602cbe328d7c25845438d8f681b584ec178ff1e83d7a736f7c6f3f45798ecee" ],
//   [ "Task1117", "b51c2131be8c524211d804b72c48e2f5a75661639abf2d26922660de700248b1" ],
//   [ "Task0426", "d12813f5f2cfce9eb9bfa287c24c5241af40b2ff7ced58df6e76aec9de622955" ]
// ]


let hashed = get_hashed(['Task0927', 'Task1029', 'Task0927', 'Task0426', 'Task1117'], 'my_secret_key')

// the hashed is a nest list with it's name and hashed value
// [
//   [ "Task0927", "533a61318ef3cffb80773718a633724836c6d3e447abf8cf46f260bb55a4a5bf" ],
//   [ "Task1029", "a602cbe328d7c25845438d8f681b584ec178ff1e83d7a736f7c6f3f45798ecee" ],
//   [ "Task0927", "533a61318ef3cffb80773718a633724836c6d3e447abf8cf46f260bb55a4a5bf" ],
//   [ "Task0426", "d12813f5f2cfce9eb9bfa287c24c5241af40b2ff7ced58df6e76aec9de622955" ],
//   [ "Task1117", "b51c2131be8c524211d804b72c48e2f5a75661639abf2d26922660de700248b1" ]
// ]
```
Since the package dependent on [hmac](https://denopkg.com/chiefbiiko/hmac/mod.ts). The `--unstable` and `--allow-net` flag should be added each time run this package.

## Todo
- [x] Create hash ring and servers tasks mapping
- [ ] Elimate Hash function dependency, reducing coupling between each function
- [ ] Add weight to each server and implement visual node in hashring
- [ ] Change datastructure for hashring 

## Reference
- [Consistent Hashing Wiki](https://en.wikipedia.org/wiki/Consistent_hashing)
- [Consistent Hashing Concept](https://www.interviewcake.com/concept/java/consistent-hashing)

## LICENSE
[MIT](https://github.com/10yung/Consistent-Tasks-Dispatcher/blob/master/LICENSE)
