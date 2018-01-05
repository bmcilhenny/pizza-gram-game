class Adapter {

  static getPizzas() {
    return fetch('http://localhost:3000/api/v1/pizzas')
      .then(response => response.json())
  }

  static updatePizza(id, updatedTallyCount) {
    debugger;
    // fetch(`http://localhost:3000/api/v1/pizzas/${id}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(updatedTallyCount)
    // });
  }

  static addComment(commentObj) {
    return fetch(`https://randopic.herokuapp.com/comments`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commentObj)
    })
  }

}
