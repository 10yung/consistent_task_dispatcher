import { get_hashed, create_hash_ring, get_server_task_map } from './dispatcher.ts'
import { assertEquals, assertArrayContains } from "https://deno.land/std/testing/asserts.ts";
import { hmac } from "../deps.ts"

let key = 'my_secret_key'

Deno.test({
    name: "Hashed Target Array",
    fn: async () => {
        let input_val = ['Jane', 'Andy']
        let result = [['Jane', hmac('sha256', key, 'Jane', 'utf8', 'hex')], ['Andy', hmac('sha256', key, 'Andy', 'utf8', 'hex')]]

        assertEquals(get_hashed(input_val, key), result)
    },
})

Deno.test({
    name: 'Create sorted hash ring base on task and server',
    fn: async () => {
        let input_servers = ['Jane', 'Andy']
        let input_tasks = ['Task0927', 'Task1029']
        let hash_ring = create_hash_ring(input_servers, input_tasks, key)

        

        assertEquals(hash_ring, [
            [ "Andy", "0a1c1ebe1a29e0eb0f9e82c5bff8826b2a183d6d4f8d5ac43fe44a6183409f36" ],
            [ "Task0927", "533a61318ef3cffb80773718a633724836c6d3e447abf8cf46f260bb55a4a5bf" ],
            [ "Jane", "822b9cc0c8402cd0f2b8b2daf974b8cb89b9ffe6eb2534ff49e38d9d27441f01" ],
            [ "Task1029", "a602cbe328d7c25845438d8f681b584ec178ff1e83d7a736f7c6f3f45798ecee" ]
          ])
        assertEquals(hash_ring.length, input_servers.length + input_tasks.length)
    },
});

Deno.test({
    name: 'Create server task map ',
    fn: async () => {
        let input_servers = ['Jane', 'Andy']
        let input_tasks = ['Task0927', 'Task1029', 'Task0927', 'Task0426', 'Task1031']
        let server_task_map = get_server_task_map(input_tasks, input_servers, key)

        assertEquals(Object.keys(server_task_map).length, input_servers.length)
        assertArrayContains(Object.values(server_task_map).flat(1), input_tasks)
    },
});