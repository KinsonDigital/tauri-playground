// Prevents additional console window on Windows in release, DO NOT REMOVE!!
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::RunEvent;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .build(tauri::generate_context!()) // build instead of run
        .expect("error while building tauri app")
        .run(|_app_handle, event| {
            if let RunEvent::Updater(updater_event) = event {
                dbg!(updater_event);
            }
        });

    println!("Message from rust!!");
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}
