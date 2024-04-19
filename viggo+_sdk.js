class ViggoChat {
    sendChat(text, update_messages = false) {
        var message_form_url = document.querySelector('.button-group.right').getElementsByTagName('a')[0].getAttribute('href')
        fetch(message_form_url)
        .then(response => {
            return response.text();
        })
        .then(html => {
            // Step 2: Parse the HTML content
            form_doc = new Utility().parseHTML(html)
            
            // Step 3: Access and manipulate elements in the parsed HTML
            // For example, let's extract the title of the webpage
            const extracted_message_form = form_doc.getElementsByClassName('content')[0].getElementsByTagName('form')[0];
            var hidden_form_values = extracted_message_form.querySelectorAll("input")
    
            var new_message_field = document.createElement('form')
            new_message_field.setAttribute('action', '/Basic/Message/SaveMessage')
            new_message_field.setAttribute('class', 'ajax')
            new_message_field.setAttribute('method', 'post')
            Array.from(hidden_form_values).forEach(element => {
                element.setAttribute('type', 'hidden')
                new_message_field.appendChild(element)
            });
            var input_field = document.createElement('input')
            input_field.setAttribute('id', 'Contents')
            input_field.setAttribute('name', 'Contents')
            new_message_field.appendChild(input_field)
    
            document.body.appendChild(new_message_field)
    
            input_field.value = text
            new Utility().submitForm(new_message_field)
    
            if (update_messages) {
                fetch(location.href+'?ajax=1')
                .then(response => {
                    return response.text();
                })
                .then(html => {
                    messages_doc = new Utility().parseHTML(html)
                    document.getElementsByClassName('list-conversation')[0].innerHTML = messages_doc.getElementsByClassName('list-conversation')[0].innerHTML
                })
            }
    
            //new_message_field.submit()
            new_message_field.remove()
        })
    }
    
    deleteChat(li, update_messages = false) {
        fetch(li.querySelector('.ajaxDeleteExecute').getAttribute('href'))
        if (update_messages) {
            fetch(location.href.replace(location.hash, '')+'?ajax=1')
            .then(response => {
                return response.text();
            })
            .then(html => {
                messages_doc = new Utility().parseHTML(html)
                document.getElementsByClassName('list-conversation')[0].innerHTML = messages_doc.getElementsByClassName('list-conversation')[0].innerHTML
            })
        }
    }
}

class Utility {
    submitForm(form) {
        // Get form data
        var formData = new FormData(form);
        
        // Send form data using AJAX
        var xhr = new XMLHttpRequest();
        xhr.open("POST", form.getAttribute('action'), true); // Replace with your backend script URL
        xhr.onload = function() {
          if (xhr.status === 200) {
            // You can handle the response here, like showing a success message or updating content
          }
        };
        xhr.send(formData);
    }
    
    clearPage() {
        console.log('Clearing page...')
        document.head.innerHTML = ''
        document.body.innerHTML = ''
    
        // Clear all intervals
        for (var i = 1; i < 1000; i++)
            clearInterval(i);
    
        // Clear all timeouts
        for (var i = 1; i < 1000; i++)
            clearTimeout(i);
        console.log('Page cleared!')
    }
    
    parseHTML(html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        return doc
    }
}



// Check if ViggoPlus exists, if not, create it
if (typeof window.ViggoPlus === 'undefined') {
    window.ViggoPlus = {}
}
  
// Check if SDK exists under ViggoPlus, if not, create it
if (typeof window.ViggoPlus.SDK === 'undefined') {
    window.ViggoPlus.SDK = {}
}  

//Sets the ViggoPlus version variable
window.ViggoPlus.Version = '1.0'

// Attach all script classes to the window object
window.ViggoPlus.SDK.ViggoChat = ViggoChat
window.ViggoPlus.SDK.Utility = Utility
