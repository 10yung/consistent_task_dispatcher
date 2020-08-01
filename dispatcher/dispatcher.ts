"use strict"
import { hmac } from "../deps.ts"

// set task dispatch type
interface ServerTask {
    [ServerName: string]: String[]
}


// create (key, hashed_value) tuple array 
export let get_hashed = (targets: Array<string>, hash_key: string, type="sha256"): Array<[string, string]> => {
    let hashed: Array<[string, string]> = []

    for(let i=0; i < targets.length; i++) {
        let hash = hmac(type, hash_key, targets[i], "utf8", "hex")
        hashed.push([targets[i], hash.toString()])
    }

    return hashed
}

// create hashring
export let create_hash_ring = (tasks: Array<string>, servers: Array<string>, hash_key: string): Array<[string, string]> => {
    let hashed_collection = get_hashed(tasks, hash_key).concat(get_hashed(servers, hash_key));

    // sort by hashed value to create hash ring
    let hash_ring = hashed_collection.sort((str1, str2) => {
        if (str1[1] < str2[1]) {
            return -1
        }
        if (str1[1] > str2[1]) {
            return 1
        }
        return 0
    })

    return hash_ring
}

// create server task mapping
export let get_server_task_map = (tasks: Array<string>, servers: Array<string>, hash_key: string): ServerTask => {
    let hash_ring = create_hash_ring(tasks, servers, hash_key)
    let server_task_map: ServerTask = {}
    let current_task: Array<string> = []

    for (const pair_index in hash_ring) {
        if (tasks.includes(hash_ring[pair_index][0])) {
            current_task.push(hash_ring[pair_index][0])
        }

        if (servers.includes(hash_ring[pair_index][0])) {
            server_task_map[hash_ring[pair_index][0]] = current_task
            current_task = []
        }

    }

    let first_server = Object.keys(server_task_map)[0]
    // dispatch the tail tasks to the first worker
    server_task_map[first_server] = server_task_map[first_server].concat(current_task)

    return server_task_map
}