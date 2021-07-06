import '../css/style.css'
import '../css/form.css'
import Head from 'next/head'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Bounty Board Create Page</title>
      </Head>

      <div className="top-bar">
        <div className="nav">
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/new">
            <a>Create Bounty</a>
          </Link>
        </div>

        <img
          id="title"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAsVBMVEUAAAD////3AQUPAAD+AwOyERHHFRT8/PwEBAT2BQja2tq1tbUICAjq6upjY2P5+fnR0dGkpKS7u7udnZ1cXFyHh4d4eHjf39/x8fFycnJTU1OWlpaBgYHn5+fOzs7IyMhNTU1CQkKMjIwtLS2qqqoVFRUjIyNGRkY0NDRra2sREREdHR0dAAA7OztYWFi4uLhtExCvHBzDGBeHFRXhExvnDBd9GRjxBBBkERGxEBQACQGn7iN2AAAJBElEQVR4nO2Za3vaOBCFrTatFWOQudqEGEMgKSQlvWx2s9v//8NWMyPbsoHGfNs8e942gCXL0pFGo5EcBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8V9BatxICP8Ve2c9YH2fXSZRL/zlLlxnusrpq11PfWSeUBesE7aX7F+2y59GtKy0c5cd1ipcUNxpWleMvHcdVThy3G3+6iVx/7GXxM3V8XFgfD01nmmN4Kt+r3k9pjUl1EevGqBz9aj5dc78cJvvZfP/84B6rXYn71cCmD1bxSaM4w00SOZIkGU0PrbIryU42XtMWcv+4TJnS1ZYbsrBPiXqlhB6VjOZkxgVlTBsd8NiLWkxEYDxNMsWkxYQNRdpz2KYhJ5touDvfSW0Gqomtxmfhku/KB1r1I0nKdi5pSFcJDylnpU7CVinbooIzMvq5bTw6jlpVqzkpDFZ9xQVD+lDLyjyHoaQz4eIShWGojJQN7be69c00lXSqqKIndVQNHovCKiuSRi24ja4gtVoNGzXriKo2nsI9ldvbUsaE1Cpl7Ee2Dnge9+hmSibsj1E3faLQdZd9ckiPPNS9s3HPM+qp1t1zDbJ1n1Fop14wt+WMSh5+p5Cqa4yhrbFPzaiS7M/8QL5mJnqVa6cdk94lClWa53m/b7iH7CBWLFyfkZlWsp3CahCPFdoW7QwZRn/tip1VmNl6HdmAZjLLNsu72W0vZ4WcbE2aDDfr3c7uioxHOOqu0PbJF/oZ3yxpwPzpsuQqqM5lbfellYbm4ZzC4L7PprQql9LTCu0gLxpJcZDausLMOYMxDeGKfM2NoZYUkrwr7MN6jxcoVObGXfVp+EeVlieeKAOeqYeqiFNo+5QMRbcUSucmNJnUoHIT5+ZhU6ElowdXfTwnUeSk99yj3Ex6YkGGdoGnIYWyYKdWUOier8VkbB3su2tXT3NeZeyWHumuEwpH1ONekXNjqNoK7w1Z48IOmwREzy59xha95lZZs3i8eWPVbikMRaG9ysm0ZlVmIgvFiGqtvSnLGEU0vDzbGwppUgdj9pH+4tBVoYxhyubPTXI65jyZhi5ZQppL1kOzkosFec3cre46WJOPNRv7eJucffEUWm0ztt1NW6EtkUyUc+d1G854GnOkMOeJkS9EoxspO5aylhWTp8CFgUdh7e8UhmZ8O50uejz1ad11CqfOZT30yeYqF8tWOrKN5hlzbKVZnwYnbVRzdh725jOH9DKtolRcFVuZdXJznLKZWu88cuJ1HHRjUAYPjqhyfzpgD02TaURiklqhZRTIIK6PfanQ9ARnFPqIUT/0veYU0/vSKufi25j+dh8EnSfioHT99C801HFl76xo5NiA90o5i/QU2nhH1sTTCq238Hr53HroKZRJxkFbLdKMH53PuePkUNZ7lQ4ujUvZhVHQYKJ9mXVHaQk9aUdrLMWmDYUz9uCHMwrJe72lUPkaOTeW1c4lkxgb9Mt0nOWc7kKQcHzRPKztgiZiuWngeSKyChXWsWmpMIgMz8TTCsP0yaumq5WyhxxsJW4TLcu43HveFi6VpU6DbogvnT5PJoPZ4puEbQN2VDuK/sId3yWzwNm+U6iDAfs9Uhh6nsbWn3O39TyXflZhYX2cIEtfLNvq1TZhMUaiyGrTOuvlyg2li6g6Kly5q3VmwjI4YsOPplNuAvey67VqDGm9DMPtgnxftR7SLinu8+5nFrytsLVa6Pqs4HFeKA76ozqPvh7GqWyH7oJONKI2bfd61D2BNL/hZKm/ZXaXCnUwoTE3nqflFT+nMSdjyGSPfpHC8hiFi+0Nxe/9J5dVdtjjlh1Hx81FSyEvAeE9XYiNyObJzYuNkyFWqmmq0j0mDNtx6YgXtaJyeBcoLE9n6HLIq+DOZdJ5iCYzfkzJMxaXK+RtK0mk598p2XDSOlHu42ZNhVrGirM9K6W9xVPGXmt6qUJiW691M26dRFOD26A6e2OXszwuekZhGFZ7i8ecTZN+LpVqGClZ/tJXyCRldnOPT88NpXFnrFSfUkj3TjIv3ttSxdZKpe+rqOo+p8j+IisdbHa7w+p5mot/tk/csFueTQbCZEzSZVfvKxwYdw7R2h+67YWJ3C6OFfZuJiVfyhV/W6dNaBIsaEIs3ZZiaiSS50XS/h7KNHkYcTNPDP9ZhUr22GSPit2zi0nz+r4DL/qztsJqEI/OaR5kJz6sFVqv4Sa2CYtyj19j1J6iJw5ZTLRdLL6lPMtZyUiWwX4xvFsUfNBhvB3rmwrr9Z435tzYJaWOvRsjF+G0FE5OKYxpIt/aQNmO76RSWJ/KGCUKq5MXgc5pClmSXUxD2+h8o2kZY/dZJSvTOrl7Ywxd3aEc/9GSu+Yzm4F345TyMgqhZH/IiVrmq1Ooa18aSL/TTsNTWM/ppTtNbCxIvKvhA0kyfXdAZH2EDU2DL1kVl7KlUahzgUKPZM8vIqY8xevbbBU832iV/eaPYbCuFMYuq1S4kXNd9hv9ZpRNY2g3RC3mHPTfZarsDvsX2T5lkyDpoTv6JPOKg44Sb+oj56QYzskx0zLQS23Cwn/9Ikm8H7Q/0mE5hpKebrkhlBVVwzunqyilELxoHG4n9vYgHqXNI+9UosVgM01y6s4wSwveQrjt7mob9Snd9KPxofPu6fgu/9XMiRcpzcMD7yyBDuT9LO8qPtGYk+2r6n5a7ef7yToO6tce/HF4tunPm9MtP00ZPLilVAflCYhutsK9KuPXCl5W1Rv0GbOH0V6WvJty6Z5R6XZP1Qrj9su9WFfV+C+F4q5jCAAAAID/BR8/fv1qP+33OyKwjf74sVtM8/3Hp8+fP//8/L6g9v788b2Twj9eXq8/fLi+th/vB2ru9evLH90U/nn14erKlrp6P3y4piZf/dlN4fcXO3rvTOEVt/j6pZuV/vXy+np9JSP/XqDxuH59ffmrk8K/f/zz6dMn+ntv/PPj704KA3K93e78T0HLW7c7tf6lucB7glr76xf2+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP5P/AuYRqZJTe8ytAAAAABJRU5ErkJggg=="
          alt="Bankless DAO"
        ></img>
      </div>
      <div className="grid wrapper">
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp
